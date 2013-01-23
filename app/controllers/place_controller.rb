class PlaceController < ApplicationController
	def placeList
		@place=Place.new
	end

	def getPlace
		@place=Place.find(params[:id])
		if @place
			render :json=>[params[:item_id],params[:tripPoint_id],@place]
		else
			render :json=>nil
		end
	end

	def create_place 
		if admCheck
			p=Place.new(params[:place])
			if p.save
				render :json=>[p.id]
			else	
				render :json=>nil
			end
		end
	end

	def search
		place=Place.find(:all,:conditions=>['name LIKE ?','%'+params[:term]+'%'],:limit=>'5')
		s=Array.new
		place.each do |p|
			s<< p.name+","+p.city
		end 
		render :text=>s		
	end
	def admCheck
		if(!UserSession.find)
			redirect_to '/rapid/index'
			return nil
		else
			return true
		end
	end
end
