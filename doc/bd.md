---------------
Documentatie Baza de date
-----------------


>- Proceduri:

 create or replace procedure verifyUserAndPass(user_name varchar2,pass varchar2,res out integer) as
v_user integer;
v_pass integer;
begin
  select count(*) into v_user from useri where username=user_name;
  select count(*) into v_pass from useri where parola=pass;
  if(v_user>0 and v_pass>0)
    then res:=1;
  else res:=0;
  end if;
end;




create or replace procedure verifyUserName(user_name varchar2,response out integer) as
v_return integer;
begin
  select count(*) into v_return from useri where username=user_name;
  if (v_return>0)
     then   response:=1;
  else response:=0;
  end if;
end;




create or replace procedure insertRevieww(table_name varchar2,user_name varchar2,id varchar2,review varchar2) as

 id_col varchar2(30);
 stmt varchar2(300);
 v_nr number;
 
begin
 
  if(table_name='electronics') then
     id_col:='product_id';
     select max(id_review) into v_nr from electronics_reviews where rownum<=1;
     v_nr:=v_nr+1;
     
     stmt:='insert into electronics_reviews(id_review,username,product_id,review,type_review,source_review,up_votes,down_votes)'||
           'values(:i,:u,:id,:r,:t,:s,:up,:do)';
     execute IMMEDIATE stmt using v_nr,user_name,id,review,1,'local',0,0;
     commit;
     
   else if(table_name='hotels') then
           id_col:='id_hotel';
           stmt:='insert into hotels_reviews(id_review,username,id_hotel,review,type_review,source_review,up_votes,down_votes,time_review)'||
           'values(:i,:u,:id,:r,:t,:s,:up,:do,:tt)';
            id_col:=dbms_random.string('U', 20);
            execute IMMEDIATE stmt using id_col,user_name,id,review,1,'local',0,0,SYSDATE;
            commit;
           end if;
   end if;

      
 end;






create or replace PACKAGE BODY aliments_info IS

function aliment_reviews(id_h number, type_r number)
return number
as
    nr_reviews number;
begin 
  select count(review_id) into nr_reviews from reviewsfood where food_id=id_h and type_review=type_r;
  
  return nr_reviews;
  EXCEPTION
      WHEN no_data_found THEN
        dbms_output.put_line('aliments_reviews: no data found!');
  
end aliment_reviews;


function is_matched_aliment(v_username varchar2, v_id_aliment varchar2)
return number

as
  user_inexistent exception;
  PRAGMA EXCEPTION_INIT(user_inexistent, -20001);
  nr number(38,0);
 
v_food_name food.food_name%type;
v_short_description food.short_description%type;
v_food_group food.food_group%type;
v_scientific_name food.scientific_name%type;
v_commercial_name food.commercial_name%type;
v_manufacturer food.manufacturer%type;
v_nitrogen_to_protein food.nitrogen_to_protein%type;
v_carbohydrate_factor food.carbohydrate_factor%type;
v_fat_factor food.fat_factor%type;
v_protein_factor  food.protein_factor%type;
v_refuse_percent food.refuse_percent%type;
v_refuse_description food.refuse_description%type;
  
u_nitrogen_to_protein_min preferencesFood.nitrogen_to_protein_min%type;
u_nitrogen_to_protein_max preferencesFood.nitrogen_to_protein_max%type;
u_carbohydrate_factor_min preferencesFood.carbohydrate_factor_min%type;
u_carbohydrate_factor_max preferencesFood.carbohydrate_factor_max%type;
u_fat_factor_min preferencesFood.fat_factor_min%type;
u_fat_factor_max preferencesFood.fat_factor_max%type;
u_protein_factor_min preferencesFood.protein_factor_min%type;
u_protein_factor_max preferencesFood.protein_factor_max%type;

begin
  select food_name,short_description,food_group,scientific_name,commercial_name ,
          manufacturer ,nitrogen_to_protein ,carbohydrate_factor  ,fat_factor ,
          protein_factor  ,refuse_percent ,refuse_description into
          v_food_name,v_short_description,v_food_group,v_scientific_name ,
          v_commercial_name,v_manufacturer,v_nitrogen_to_protein,
          v_carbohydrate_factor,v_fat_factor,v_protein_factor,v_refuse_percent,
          v_refuse_description  from food where food_id=v_id_aliment;    
      
   
  select count(*) into nr from preferencesFood ap 
          where  ap.username= v_username;   
  
  if (nr=0) then 

    return 0;
  end if;
  --verify 
  select nitrogen_to_protein_min ,nitrogen_to_protein_max ,carbohydrate_factor_min,
          carbohydrate_factor_max,fat_factor_min ,fat_factor_max ,
          protein_factor_min ,protein_factor_max into u_nitrogen_to_protein_min ,
          u_nitrogen_to_protein_max ,u_carbohydrate_factor_min,
          u_carbohydrate_factor_max,u_fat_factor_min ,u_fat_factor_max ,
          u_protein_factor_min ,u_protein_factor_max from preferencesFood where username=v_username;
  
  if (u_nitrogen_to_protein_max<> null and v_nitrogen_to_protein>= u_nitrogen_to_protein_max) then 
   --dbms_output.put_line('picat u_nr_calories_max');
    return 0;
  end if;
  
  if (u_carbohydrate_factor_max<> null and v_carbohydrate_factor >= u_carbohydrate_factor_max) then 
   --dbms_output.put_line('picat u_nr_lipids_max');
    return 0;
  end if;
 
  if (u_fat_factor_max<> null and v_fat_factor>= u_fat_factor_max) then 
   --dbms_output.put_line('picat u_nr_carbohydrates_max');
    return 0;
  end if;
  
  if (u_protein_factor_max<> null and v_protein_factor>= u_protein_factor_max) then 
   --dbms_output.put_line('picat u_nr_carbohydrates_max');
    return 0;
  end if;

  return 1; 
  
  EXCEPTION
      WHEN no_data_found THEN
        dbms_output.put_line('is matched aliment: no data found!');
      when invalid_cursor then
        dbms_output.put_line('matched aliments: invalid cursor!');
      when ACCESS_INTO_NULL then 
        dbms_output.put_line('matched aliments:ACCESS_INTO_NULL!');
      when PROGRAM_ERROR then
         dbms_output.put_line('program error!');
end is_matched_aliment;


procedure matched_aliments(v_username varchar2, l_rez out rezult_list)

as
  user_inexistent exception;
  PRAGMA EXCEPTION_INIT(user_inexistent, -20001);
  
  --de gasit motivul erorii
  cursor aliment_cursor is select h.food_id as v_id_aliment,food_name
    from food h join reviewsfood h_r on h.food_id=h_r.food_id 
        order by aliment_reviews(h.food_id,1) desc; 
  nr_matched number(38,0):=0; 
  
begin 
    select count(*) into nr_matched from useri where username=v_username;
    if (nr_matched=0) then raise user_inexistent;
    
    else 
      nr_matched:=0;
      SELECT h.food_id BULK COLLECT INTO l_rez FROM food h join reviewsfood h_r on h.food_id=h_r.food_id
      where aliments_info.is_matched_aliment(v_username,h.food_id)=1
          order by aliments_info.aliment_reviews(h.food_id,1) desc;
   
    end if;
    EXCEPTION
      WHEN no_data_found THEN
        dbms_output.put_line('matched aliments: no data found!');
      when invalid_cursor then
        dbms_output.put_line('matched aliments: invalid cursor!');
      when user_inexistent then 
        dbms_output.put_line('matched aliments:inexistent user!');
       
end matched_aliments;

end aliments_info;





create or replace PACKAGE BODY tops_aliments IS

  procedure most_controversial( l_rez out rezult_list)
  as   
  begin  
  
  SELECT food_id BULK COLLECT INTO l_rez FROM food where  nr_dif_positive_neg_rev(food_id)<20 
        order by nr_total_reviews(food_id) desc;         

  end most_controversial;
  

  function nr_dif_positive_neg_rev(v_id_aliment varchar2) return number
  as
  nr_rev number(38,0);
  
  begin
    select abs(sum(UP_VOTES)-sum(DOWN_VOTES)) into nr_rev from reviewsfood where food_id=v_id_aliment;
    return nr_rev;    
  end nr_dif_positive_neg_rev;

  function nr_total_reviews(v_id_aliment varchar2) return number
  as
  nr_reviews number(38,0);
  
  begin 
    select (sum(up_votes)+sum(down_votes)) into nr_reviews from reviewsfood where food_id=v_id_aliment;
    return nr_reviews;
  end nr_total_reviews;

  function nr_matched_users(v_id_aliment varchar2) return number
  is 
  cursor cursor_useri is select * from useri;
  nr_users_matched number(38,0):=0;
  begin 
    for line in cursor_useri 
    loop
      if (aliments_info.is_matched_aliment(line.username, v_id_aliment)=1)
      then nr_users_matched:=nr_users_matched+1;
      end if;
    end loop;
    return nr_users_matched;
    exception 
    WHEN no_data_found THEN
        dbms_output.put_line('aliment_reviews: no data found!');    
  end nr_matched_users;

  procedure most_matched_aliments(l_rez out rezult_list)
  is   
  begin 
  
   SELECT food_id BULK COLLECT INTO l_rez FROM food 
        where nr_matched_users(food_id)>0  order by nr_matched_users(food_id) desc;     
  
     exception
    when no_data_found   
      then dbms_output.put_line('most matched aliments:no data found');
    end most_matched_aliments;
 
END tops_aliments;



create or replace PACKAGE BODY hotels_info IS

function hotel_reviews(id_h number, type_r number)
return number deterministic
as
    nr_reviews number;
begin 
  select count(id_review) into nr_reviews from HOTELS_REVIEWS where id_hotel=id_h and type_review=type_r;
  
  return nr_reviews;
  EXCEPTION
      WHEN no_data_found THEN
        dbms_output.put_line('hotel_reviews: no data found!');
  
end hotel_reviews;


function is_matched_hotel(v_username varchar2, v_id_hotel varchar2)
return number

as
user_inexistent exception;
PRAGMA EXCEPTION_INIT(user_inexistent, -20001);
nr number(38,0);
v_country hotels.country%type;
v_city hotels.city%type;
v_stars hotels.stars%type;
v_conf_rooms number(38,0);
rand number(38,0);
v_price number (38,0);
v_disabled_people number(1,0);
v_pet_friendly number(1,0);

v_has_restaurant number(1,0);
v_playground number(1,0);
v_has_non_smoking number(2);
v_has_smoking number(2);
v_free_internet number(1);
v_free_cancellation number(1);
v_free_parking number(1); 
v_Swimming_pool number(1); 


u_min_stars number(38,0);
u_max_stars number(38,0);
u_CONFERINCE_ROOM NUMBER(2,0);
u_PRICE_MAX NUMBER(9,2);
u_DISABLED_PEOPLE NUMBER(1,0);
u_PET_FRIENDLY NUMBER(1,0);
u_has_non_smoking number(2);
u_has_smoking number(2);
u_free_internet number(1);
u_free_cancellation number(1);
u_free_parking number(1); 
u_Swimming_pool number(1); 

u_HAS_RESTAURANT NUMBER(1,0);
u_PLAYGROUND NUMBER(1,0);

begin
  select   country, city, stars, conference_room,
      price, disabled_people, pet_friendly,has_restaurant,PLAYGROUND,has_non_smoking,has_smoking,
      free_internet , free_cancellation , free_parking,Swimming_pool into 
       v_country, v_city, v_stars, v_conf_rooms,  v_price,
      v_disabled_people, v_pet_friendly, v_has_restaurant, v_playground, v_has_non_smoking,v_has_smoking,
      v_free_internet , v_free_cancellation , v_free_parking,v_Swimming_pool   from hotels where id_hotel=v_id_hotel;      
      
   
   --verify location
   select count(*) into nr from LOCATION_PREFERENCE l join PREFERENCE_HOTELS_LOCATION p on l.location_id=p.location_id 
          where  (v_country,v_city) in (select country,city  from  LOCATION_PREFERENCE l1 join PREFERENCE_HOTELS_LOCATION p1 on 
          l1.location_id=p1.location_id  where p1.username= v_username);   
  
  if (nr=0) then 
  --dbms_output.put_line('picat location');
  return 0;
  end if;
  --verify 
    select MIN_STARS, MAX_STARS, CONFERINCE_ROOM, PRICE_MAX, DISABLED_PEOPLE, PET_FRIENDLY, HAS_RESTAURANT, 
    PLAYGROUND, has_non_smoking, has_smoking, free_internet , free_cancellation , free_parking,Swimming_pool 
    into u_MIN_STARS, u_MAX_STARS, u_CONFERINCE_ROOM,  u_PRICE_MAX, u_DISABLED_PEOPLE, u_PET_FRIENDLY,  
    u_HAS_RESTAURANT, u_PLAYGROUND, u_has_non_smoking,u_has_smoking, u_free_internet , u_free_cancellation , u_free_parking,u_Swimming_pool 
    from HOTEL_PREFERENCES where username=v_username;
    
    
    if (u_min_stars <> null and u_min_stars>= v_stars) then
  --dbms_output.put_line('diferite stars hotel:'||v_stars);
    return 0;
    end if;
  
  if (u_max_stars<> null and v_stars >= u_max_stars) then 
   --dbms_output.put_line('picat stars');
  return 0;
  end if;
  
  if (u_conferince_room=1 and v_conf_rooms<1) then 
  --dbms_output.put_line('picat conf room');
  return 0;
  end if;
  
  if ( u_price_max<> null  ) then
      if (v_price>u_price_max ) then 
      --dbms_output.put_line('picat price');
      return 0;
      end if;
  end if;
  
  if (u_disabled_people<> null and u_disabled_people=1 and v_disabled_people=0) then 
  --dbms_output.put_line('picat dis people');
  return 0;
  end if;
  
  if (u_PET_FRIENDLY<> null and u_PET_FRIENDLY=1 and v_PET_FRIENDLY=0) then 
  --dbms_output.put_line('picat dis pet_friendly');
  return 0;
  end if;
  
  
  
   if (u_HAS_RESTAURANT<> null and u_HAS_RESTAURANT=1 and v_HAS_RESTAURANT=0) then 
   --dbms_output.put_line('picat has restaurant');
   return 0;
  end if;
  
  if (u_PLAYGROUND<> null and u_PLAYGROUND=1 and v_PLAYGROUND=0) 
   
  then
  --dbms_output.put_line('picat playground');
  return 0;
  end if;
  
  if (u_has_non_smoking<> null and u_has_non_smoking=1 and v_has_non_smoking=0) 
   
  then
  --dbms_output.put_line('picat playground');
  return 0;
  end if;
  
  if (u_has_smoking<> null and u_has_smoking=1 and v_has_smoking=0) 
   
  then
  --dbms_output.put_line('picat playground');
  return 0;
  end if;
  
  if (u_free_internet<> null and u_free_internet=1 and v_free_internet=0) 
   
  then
  --dbms_output.put_line('picat playground');
  return 0;
  end if;
  
   if (u_free_cancellation<> null and u_free_cancellation=1 and v_free_cancellation=0) 
   
  then
  --dbms_output.put_line('picat playground');
  return 0;
  end if;
  
  
   if (u_free_parking<> null and u_free_parking=1 and v_free_parking=0) 
   
  then
  --dbms_output.put_line('picat playground');
  return 0;
  end if;
  
  if (u_Swimming_pool<> null and u_Swimming_pool=1 and v_Swimming_pool=0) 
   
  then
  --dbms_output.put_line('picat playground');
  return 0;
  end if; 
 
  
  return 1; 
  
  EXCEPTION
      WHEN no_data_found THEN
        dbms_output.put_line('is matched hotel: no data found!');
      when invalid_cursor then
        dbms_output.put_line('matched hotels: invalid cursor!');
      when ACCESS_INTO_NULL then 
        dbms_output.put_line('matched hotels:ACCESS_INTO_NULL!');
      when PROGRAM_ERROR then
         dbms_output.put_line('program error!');
end is_matched_hotel;


procedure matched_hotels(v_username varchar2, l_rez out rezult_list)

as
  user_inexistent exception;
  PRAGMA EXCEPTION_INIT(user_inexistent, -20001);
  h_list hotel_list:=hotel_list();
  cursor hotel_cursor is select h.id_hotel as v_id_hotel,name_hotel,country , city , stars 
    from hotels h join hotels_reviews h_r on h.id_hotel=h_r.id_hotel 
        order by h.up_votes desc, hotel_reviews(h.id_hotel,1) desc; 
  nr_matched number(38,0):=0; 
  
begin 
    select count(*) into nr_matched from useri where username=v_username;
    if (nr_matched=0) then raise user_inexistent;
    
    else
        nr_matched:=0;
        select count(*) into nr_matched from hotel_preferences h_p join preference_hotels_location p_h_l on h_p.username=p_h_l.username
            where h_p.username=v_username;
        if  (nr_matched=0) then raise user_inexistent;
        
            else 
              nr_matched:=0;
              SELECT h.id_hotel BULK COLLECT INTO l_rez FROM hotels h join hotels_reviews h_r on h.id_hotel=h_r.id_hotel
              where is_matched_hotel(v_username,h.id_hotel)=1
                  order by h.up_votes desc, hotel_reviews(h.id_hotel,1) desc;
        end if;
       
        end if;
    EXCEPTION
      WHEN no_data_found THEN
        dbms_output.put_line('matched hotels: no data found!');
      when invalid_cursor then
        dbms_output.put_line('matched hotels: invalid cursor!');
      when user_inexistent then 
        dbms_output.put_line('matched hotels:inexistent user!');
       
end matched_hotels;

end hotels_info;



-< Pachete:

create or replace PACKAGE BODY tops_hotels IS

  procedure most_controversial( l_rez out rezult_list)
  as   
  begin  
  
  SELECT id_hotel BULK COLLECT INTO l_rez FROM hotels where  nr_dif_positive_neg_rev(id_hotel) between 0 and 20  
        order by nr_total_reviews(id_hotel) desc;         

  end most_controversial;
  

  function nr_dif_positive_neg_rev(v_id_hotel varchar2) return number deterministic
  as
  nr_rev number(38,0);
  
  begin
    select abs(hotels_info.hotel_reviews(id_hotel,1)-hotels_info.hotel_reviews(id_hotel,0)) into nr_rev from hotels where id_hotel=v_id_hotel;
    return nr_rev; 
  exception  
  WHEN no_data_found THEN
        dbms_output.put_line('hotel_reviews: no data found!'); 
        return -1;
  end nr_dif_positive_neg_rev;

  function nr_total_reviews(v_id_hotel varchar2) return number
  as
  nr_reviews number(38,0);
  
  begin 
    select (up_votes+down_votes) into nr_reviews from hotels where id_hotel=v_id_hotel;
    return nr_reviews;
  end nr_total_reviews;

  function nr_matched_users(v_id_hotel varchar2) return number deterministic
  as 
  cursor cursor_useri is select * from useri;
  nr_users_matched number(38,0):=0;
  begin 
    for line in cursor_useri 
    loop
      if (hotels_info.is_matched_hotel(line.username, v_id_hotel)=1)
      then nr_users_matched:=nr_users_matched+1;
      end if;
    end loop;
    return nr_users_matched;
    exception 
    WHEN no_data_found THEN
        dbms_output.put_line('hotel_reviews: no data found!');    
  end nr_matched_users;

  procedure most_matched_hotels (l_rez out rezult_list)
  is   
  begin 
  
   SELECT id_hotel BULK COLLECT INTO l_rez FROM hotels 
        where nr_matched_users(id_hotel)>0  order by nr_matched_users(id_hotel) desc;     
  
     exception
    when no_data_found   
      then dbms_output.put_line('most matched hotels:no data found');
    end most_matched_hotels;
 
END tops_hotels;