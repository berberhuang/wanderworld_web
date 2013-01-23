class UserSession < Authlogic::Session::Base
	attr_accessor :username
end
