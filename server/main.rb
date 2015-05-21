require 'sinatra'
require 'omniauth-twitter'

configure do
	set :sessions,
		httponly: true,
		secure: production?,
		expire_after: 31536000,
		secret: ENV['SESSION_SECRET']

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