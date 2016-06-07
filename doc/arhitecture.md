Edec
===================
Etical decisions for consumers.

----------


Descrierea proiectului
-------------

Edec este un instrument ce usureaza alegerile utizatorilor atunci cand vine vorba de electronice,hoteluri sau mancare.

> **Cum functioneaza:**

> - Edec dispune de o baza de date in care produsele contin informatii legate de substantele folosite, locul de provenienta, si ideologiile companiilor producatoare.
> - Userii isi fac cont, seteaza preferintele asupra unui produs dintr-o anumita categorie,de ce companie sa fie produs ,detalii tehnice asupra produsului precum marca , culoare ,brand ,model. Pot exista mai multe preferinte pentru o anumita categorie. 
> - De asemenea userii pot 'urmari' produse.Acestia vor fi notificati periodic atat prin email cat si in pagina web, atunci cand o modificare are loc asupra produselor urmarite.
> - Vor fi afsate diverse topuri care sunt actualizate periodic si care ofera utilizatorilor o privire generala asupra unor produse.
> - Utilizatorii pot sa vizualizeze si sa adauge noi review-ri la un produs.Precum sa il voteze.

-----------------------------------------------------
Entitati Componente
-------------------

In principiul Edec este compus din produse, si caracteristicile care le definesc, dar si din preferintele userilor, review-ri cat si voturi care sunt folosite pentru a crea statistici referitoare la trendurile anumitor caracteristici.


> **Useri:**

>- user
>-- avatar
>-- nume
>-- email
>-- caracteristici

>**Produse:**

>- produs
>--nume produs
>--imagine
>--caracteristici
>-- produse care se potrivesc cu profilul mai multor utilizatori
>-- produse care se potrivesc cel mai bine cu profilul utilizatorului curent
>-- cele mai dezirabile
>-- cele mai indezirabile
>-- cele mai cotroversate

>- review
>-- review-uri pozitive
>-- review-uri negative

Pagini
--------------
Url		    | Titlu
------------| ---
http://edec2016.ddns.net/                | Homepage /Search Product ->Aici vor fi afisate topurile 
http://edec.ddns.net/signin          | Login
http://edec2016.ddns.net/signup            |Sign Up
http://edec2016.ddns.net/userprofile      | User Profile
http://edec2016.ddns.net/product/electronics/B00U8KSN4M | Product page
http://edec2016.ddns.net/notification       | Notificari 


---------------
Descriere Api
-----------------

Api Rest
------------------
Request       | Descriere    | Necesita Cookie Setat | Format returnat
--------------| -------------| ----------------------| -----
http://edec2016.ddns.net/unloged/pozitiveReviews?category=[category]  | Ofera primele 4 review-ri cu cele mai multe voturi pozotive. |NU | HTML
http://edec2016.ddns.net/unloged/negativeReviews?category=[category]      | Ofera primele 4 review-ri  cu cele mai multe voturi negative. | NU | HTML
http://edec2016.ddns.net/logged/mostMatcedToYou?category=[category]       | Returneaza cele mai potrivite produse pentru user. | DA
http://edec2016.ddns.net/unloged/mostdesirable?category=[category]&maxrows=[maxrows]&trim=[trim] | Returneaza cele nai desirabile produse. | NU | HTML
http://edec2016.ddns.net/unloged/mostundesirable?category=[category]&maxrows=[maxrows]&trim=[trim] | Returneaza cele mai indezirabile produse. | NU | HTML
http://edec2016.ddns.net/controversial?category=[category]&maxrows=[maxrows]&trim=[trim] | Returneaza cele mai controversate produse. | NU | HTML
http://edec2016.ddns.net/logged/youmightlike?category=[category]   | Returneaza produsele care ar putea sa placa unui utilizator. | DA | HTML
http://edec2016.ddns.net/unlogged/mostmatched?category=[category]&maxrows=[maxrows]&trim=[trim] | Returneaza produsele care se potrivesc cu cei mai multi utilizatori | NU  |HTML
http://edec2016.ddns.net/logged/stayawayfrom?category=[category]  | Returneaza cele mai nepotrivite alegeri(produse) pentru un utilizator. | DA |HTML
http://edec2016.ddns.net/product/[category]/[product_id] | Returneaza detalii + review-ri al unui produs. | NU | HTML
http://edec2016.ddns.net/product/addReview?category=[category]&id=[product_id]&review=[review] | Adauga un nou review la un produs. | DA | HTML
http://edec2016.ddns.net/userprofile/reviews?username=[username]&category=[category]&page=[page] | Returneaza review-rile userului specificat. | NU | HTML 


---------------
Api-uri utilizate
-----------------

Api Rest
------------------
Request       | Descriere    
--------------| ----------
https://api.nal.usda.gov/ndb/list| Returneaza json cu informatii din categoria Food
http://developer.expedia.com/directory|Returneaza json cu informatii din categoria Hotels
https://go.developer.ebay.com/ | Returneaza informatii despre electronice din categorie Electronics
 http://webservices.amazon.com/onca/xml? |Returneaza informatii despre electronice din categorie Electronics

>- Detalii
>-- [category] -> String: categoria catre care se face cererea.
>-- [maxrows] -> Number: numarul de elemente ce vor fi returnate.
>-- [trim] -> Boolean: indica daca descrierea produsului va fi decupata.
>-- [product_id] ->String: id-ul produsului cerut.
>-- [review] ->String: review-ul ce va fi adaugat.



------------------------ 
Etape implementare
------------------------

1. Schite/Design/Arhitectura
2. Modelare baza de date
3. Creare pagini frontend
4. Design backend
5. Creare request-uri api
6. Design proceduri oracle
7. Design & implementare arhitectura MVC, links rewrite
8. Implementare proceduri oracle
9. Implementare module backend (node js)
10. Implementarea view-urilor pe baza html&css&javascript
11. Testing
12. Deployment

----------------------

##Componenta echipa

> **Componenti echipei in ordine alfabetica:**
> 
>- Balan Valeria
>- Colibaba Valentin
>- Coman Bianca-Roxana
>- Tifui Vali-Andrei