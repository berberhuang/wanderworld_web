# encoding: UTF-8
class CommentMailer < ActionMailer::Base
  default from: "WanderWorld<bluebetterlife@gmail.com>"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.comment_mailer.notify.subject
  #
  def notify comment_id
    @c=Comment.joins(:user,:group).select('title,content,group_id,trip_id,username').find_by_id(comment_id)
    @receiver=Group.joins(:user).select('username,email,fbid').find_by_id(@c.group_id)
    if @receiver.fbid
    	@email=@receiver.email.slice(8,@receiver.email.size-1)
    else
	@email=@receiver.email
    end
    mail :to=>@email, :subject=>"WanderWorld-留言通知"
  end
end
