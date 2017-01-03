-- The query below is for postgres
-- Note that "" are used for identifers and '' are used as strings


-- INSERT INTO `User` (`id`,`displayName`,`imgUrl`,`role`,`banned`,`auth`,`mmr`,`spareTxt`,`spareInt`,`createdAt`,`updatedAt`,`RoomId`) VALUES
-- ('','','','','','','','','','','','');
-- INSERT INTO `Library` (`id`,`prompt`,`level`,`approved`,`spareTxt`,`spareInt`,`createdAt`,`updatedAt`,`UserId`) VALUES
-- ('','','','','','','','','');
-- INSERT INTO `Room` (`id`,`name`,`round`,`spareTxt`,`createdAt`,`updatedAt`) VALUES
-- ('','','','','','');
-- INSERT INTO `Commend` (`id`,`url`,`insultFlag`,`createdAt`,`updatedAt`) VALUES
-- ('','','','','');
-- INSERT INTO `Solution` (`id`,`name`,`createdAt`,`updatedAt`,`LibraryId`) VALUES
-- ('','','','','');
SET SESSION statement_timeout TO 10000;
DELETE FROM "User";
DELETE FROM "Library";
DELETE FROM "Solution";

INSERT INTO "User" ("displayName", "auth", "imgUrl", "role", "banned", "createdAt", "updatedAt") 
Values ('Khoa','8008135', 'http://doge2048.com/meta/doge-600.png', 'admin', false, NOW(), NOW());

INSERT INTO "User" ("displayName", "auth", "imgUrl", "role", "banned", "createdAt", "updatedAt") 
Values ('Patrick','8==D', 'http://doge2048.com/meta/doge-600.png', 'admin', false, NOW(), NOW());

INSERT INTO "User" ("displayName", "auth", "imgUrl", "role", "banned", "createdAt", "updatedAt") 
Values ('Bruce','({})','http://doge2048.com/meta/doge-600.png', 'admin', false, NOW(), NOW());

INSERT INTO "User" ("displayName", "auth", "imgUrl", "role", "banned", "createdAt", "updatedAt") 
Values ('Stella','8008', 'http://doge2048.com/meta/doge-600.png', 'user', false, NOW(), NOW());

INSERT INTO "User" ("displayName", "auth","imgUrl", "role", "banned", "createdAt", "updatedAt") 
Values ('Donald','696969', 'http://static.boredpanda.com/blog/wp-content/uploads/2016/11/unflattering-donald-trump-chin-photo-ps-battle-35.jpg', 'user', true, NOW(), NOW());


-- happy 
INSERT INTO "Library" ("prompt", "level", "approved", "createdAt", "updatedAt", "UserId")
Values ('happy', 1, true, NOW(), NOW(), (Select "id" from "User" WHERE "displayName"='Khoa'));

INSERT INTO "Solution" ("name","length","createdAt","updatedAt","LibraryId","approved") 
VALUES('😃',1,NOW(),NOW(),(Select "id" from "Library" WHERE "prompt"='happy'), true);

INSERT INTO "Solution" ("name","length","createdAt","updatedAt","LibraryId","approved") 
VALUES('😀',1,NOW(),NOW(),(Select "id" from "Library" WHERE "prompt"='happy'), true);

INSERT INTO "Solution" ("name","length","createdAt","updatedAt","LibraryId","approved") 
VALUES('😂',1,NOW(),NOW(),(Select "id" from "Library" WHERE "prompt"='happy'), true);

INSERT INTO "Solution" ("name","length","createdAt","updatedAt","LibraryId","approved") 
VALUES('😁',1,NOW(),NOW(),(Select "id" from "Library" WHERE "prompt"='happy'), true);

INSERT INTO "Solution" ("name","length","createdAt","updatedAt","LibraryId","approved") 
VALUES('😄',1,NOW(),NOW(),(Select "id" from "Library" WHERE "prompt"='happy'), true);

-- sad
INSERT INTO "Library" ("prompt", "level", "approved", "createdAt", "updatedAt", "UserId")
Values ('sad', 1, true, NOW(), NOW(), (Select "id" from "User" WHERE "displayName"='Bruce'));

INSERT INTO "Solution" ("name","length","createdAt","updatedAt","LibraryId","approved") 
VALUES('🙁',1, NOW(), NOW(),(Select "id" from "Library" WHERE "prompt"='sad'), true);

INSERT INTO "Solution" ("name","length","createdAt","updatedAt","LibraryId","approved") 
VALUES('☹️',1, NOW(), NOW(),(Select "id" from "Library" WHERE "prompt"='sad'), true);

INSERT INTO "Solution" ("name","length","createdAt","updatedAt","LibraryId","approved") 
VALUES('😟',1, NOW(), NOW(),(Select "id" from "Library" WHERE "prompt"='sad'), true);

INSERT INTO "Solution" ("name","length","createdAt","updatedAt","LibraryId","approved") 
VALUES('😢',1, NOW(), NOW(),(Select "id" from "Library" WHERE "prompt"='sad'), true);

INSERT INTO "Solution" ("name","length","createdAt","updatedAt","LibraryId","approved") 
VALUES('😭',1, NOW(), NOW(),(Select "id" from "Library" WHERE "prompt"='sad'), true);


-- top gun
INSERT INTO "Library" ("prompt", "level", "approved", "createdAt", "updatedAt", "UserId")
Values ('top gun', 1, true, NOW(), NOW(), (Select "id" from "User" WHERE "displayName"='Patrick'));


INSERT INTO "Solution" ("name","length","createdAt","updatedAt","LibraryId","approved") 
VALUES('☝🔫',1,NOW(), NOW(),(Select "id" from "Library" WHERE "prompt"='top gun'), true);


-- buff
INSERT INTO "Library" ("prompt", "level", "approved", "createdAt", "updatedAt", "UserId")
Values ('buff', 1, true, NOW(), NOW(), (Select "id" from "User" WHERE "displayName"='Patrick'));

INSERT INTO "Solution" ("name","length","createdAt","updatedAt","LibraryId","approved") 
VALUES('💪',1,NOW(), NOW(),(Select "id" from "Library" WHERE "prompt"='buff'), true);



-- unexepected gasm
INSERT INTO "Library" ("prompt", "level", "approved", "createdAt", "updatedAt", "UserId")
Values ('unexepected gasm', 3, true, NOW(), NOW(), (Select "id" from "User" WHERE "displayName"='Bruce'));

INSERT INTO "Solution" ("name","length","createdAt","updatedAt","LibraryId","approved") 
VALUES('😮',1,NOW(), NOW(),(Select "id" from "Library" WHERE "prompt"='unexepected gasm'), true);


-- Commend
INSERT INTO "Commend" ("url", "insultFlag", "createdAt", "updatedAt")
Values (
          'http://s2.quickmeme.com/img/4b/4b30399fd87f9d9c6d34f6b0884ee41bf6822148b09fc40144dd1ad6c00051e0.jpg', 
          false, NOW(), NOW()
       );

INSERT INTO "Commend" ("url", "insultFlag", "createdAt", "updatedAt")
Values (
          'http://weknowmemes.com/wp-content/uploads/2012/05/boy-that-escalated-quickly.jpg', 
          false, NOW(), NOW()
       );

INSERT INTO "Commend" ("url", "insultFlag", "createdAt", "updatedAt")
Values (
          'https://s-media-cache-ak0.pinimg.com/236x/2b/99/af/2b99af725995855ce96f30b52d5a4975.jpg', 
          false, NOW(), NOW()
       );

INSERT INTO "Commend" ("url", "insultFlag", "createdAt", "updatedAt")
Values (
          'https://media.giphy.com/media/dOJt6XZlQw8qQ/giphy.gif', 
          false, NOW(), NOW()
       );

INSERT INTO "Commend" ("url", "insultFlag", "createdAt", "updatedAt")
Values (
          'http://s2.quickmeme.com/img/2a/2a2660244d760a4368a1f994fdeb68b9bc1744d03007a04aaf6a6dc19ed48e64.jpg', 
          false, NOW(), NOW()
       );

-- Insults

INSERT INTO "Commend" ("url", "insultFlag", "createdAt", "updatedAt")
Values (
          'https://media.giphy.com/media/xT9DPLBZEnek4zvEQg/giphy.gif', 
          true, NOW(), NOW()
       );

INSERT INTO "Commend" ("url", "insultFlag", "createdAt", "updatedAt")
Values (
          'https://i.imgflip.com/fv09f.jpg', 
          true, NOW(), NOW()
       );

INSERT INTO "Commend" ("url", "insultFlag", "createdAt", "updatedAt")
Values (
          'http://s2.quickmeme.com/img/8a/8a202184c338637c55139ba665ce60e1c5ced87cf032df9e1131b7b21b7e31d6.jpg', 
          true, NOW(), NOW()
       );
       
INSERT INTO "Commend" ("url", "insultFlag", "createdAt", "updatedAt")
Values (
          'https://cdn.meme.am/cache/instances/folder26/59617026.jpg', 
          true, NOW(), NOW()
       );
       