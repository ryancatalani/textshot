require 'sinatra'
require 'omniauth-twitter'
require 'twitter'

configure do
	set :sessions,
		httponly: true,
		secure: production?,
		expire_after: 31536000,
		secret: ENV['SESSION_SECRET']

	set :protection, except: :frame_options

	use OmniAuth::Builder do
		provider :twitter, ENV['CONSUMER_KEY'], ENV['CONSUMER_SECRET']
	end
end

helpers do
	def current_user
		return false if session[:twitter].nil?
		return {
			nickname: session[:twitter][:nickname],
			img: session[:twitter][:img],
			token: session[:twitter][:token],
			secret: session[:twitter][:secret]
		}
	end

	def twitter_client
		return false if !current_user
		client ||= Twitter::REST::Client.new do |config|
			config.consumer_key = ENV['CONSUMER_KEY']
			config.consumer_secret = ENV['CONSUMER_SECRET']
			config.access_token = session[:twitter][:token]
			config.access_token_secret = session[:twitter][:secret]
		end
		return client
	end
end

get '/' do
	erb :index
end

get '/auth/twitter/callback' do
	auth = env['omniauth.auth']
	logger.info auth
	session[:twitter] = {}
	session[:twitter][:nickname] = auth.info.nickname
	session[:twitter][:img] = auth.info.image
	session[:twitter][:token] = auth.credentials.token
	session[:twitter][:secret] = auth.credentials.secret

	redirect to('/')
end

get '/signout' do
	session[:twitter] = nil
	redirect to('/')
end

post '/post_tweet' do
	file = Tempfile.new('temp.png')
	begin
		file.write( Base64.decode64(params[:tweet_input_img]) )
		file.rewind
		twitter_client.update_with_media(params[:tweet_input_composer], file)
	ensure
		file.close
		file.unlink
	end
	redirect to('/')
end