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

INSERT INTO "User" ("displayName", "imgUrl", "role", "banned", "createdAt", "updatedAt") 
Values ('Khoa', 'http://doge2048.com/meta/doge-600.png', 'admin', false, NOW(), NOW());

INSERT INTO "User" ("displayName", "imgUrl", "role", "banned", "createdAt", "updatedAt") 
Values ('Patrick', 'http://doge2048.com/meta/doge-600.png', 'admin', false, NOW(), NOW());

INSERT INTO "User" ("displayName", "imgUrl", "role", "banned", "createdAt", "updatedAt") 
Values ('Bruce', 'http://doge2048.com/meta/doge-600.png', 'admin', false, NOW(), NOW());

INSERT INTO "User" ("displayName", "imgUrl", "role", "banned", "createdAt", "updatedAt") 
Values ('Stella', 'http://doge2048.com/meta/doge-600.png', 'user', false, NOW(), NOW());

INSERT INTO "User" ("displayName", "imgUrl", "role", "banned", "createdAt", "updatedAt") 
Values ('Donald', 'http://static.boredpanda.com/blog/wp-content/uploads/2016/11/unflattering-donald-trump-chin-photo-ps-battle-35.jpg', 'user', true, NOW(), NOW());


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
-- INSERT INTO "Library" ("prompt", "level", "approved", "createdAt", "updatedAt", "UserId")
-- Values ('sad', 1, true, NOW(), NOW(), (Select "id" from "User" WHERE "displayName"='Bruce'), true);

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