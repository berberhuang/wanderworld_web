# encoding: UTF-8
class CommentMailer < ActionMailer::Base
  default from: "WanderWorld<bluebetterlife@gmail.com>"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.comment_mailer.notify.subject
  #
  def notify trip_id,group_id,sender_username,title,content,receiver
   @trip_id=trip_id
   @group_id=group_id
   @sender_username=sender_username
   @title=title
   @content=content
   @receiver=receiver
    if @receiver.fbid
    	@email=@receiver.email.slice(8,@receiver.email.size-1)
    else
	@email=@receiver.email
    end
    mail :to=>@email, :subject=>"WanderWorld-留言通知"
  end
  
  def notifyreply trip_id,group_id,sender_username,title,content,receiver
   @trip_id=trip_id
   @group_id=group_id
   @sender_username=sender_username
   @title=title
   @content=content
   @receiver=receiver
    if @receiver.fbid
    	@email=@receiver.email.slice(8,@receiver.email.size-1)
    else
	@email=@receiver.email
    end
    mail :to=>@email, :subject=>"WanderWorld-留言通知"
  end
end
