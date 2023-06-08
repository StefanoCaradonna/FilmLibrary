BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "films" ( 
	"id" INTEGER, 
	"title" TEXT NOT NULL, 
	"favorite" INTEGER NOT NULL DEFAULT (0), 
	"watchdate" TEXT, 
	"rating" INTEGER DEFAULT 0, 
	"user" INTEGER NOT NULL, 
	PRIMARY KEY("id"), 
	FOREIGN KEY("user") REFERENCES "users"("id") 
);

CREATE TABLE IF NOT EXISTS "users" (
	 "id" INTEGER NOT NULL, 
	 "email" TEXT NOT NULL, 
	 "name" TEXT, 
	 "hash" TEXT NOT NULL, 
	 "salt" TEXT NOT NULL, 
	 PRIMARY KEY("id" AUTOINCREMENT) 
);

/*password=password*/
INSERT INTO "users"(email, name, hash, salt) 
	VALUES ('stefano@test.com','Stefano', '4ba3a438a65c9dd0f1b922de07d7a5743c4a71e093c8fe59af1ce3d4b1bf7d79', '107b99e710311b49'); 
INSERT INTO "users"(email, name, hash, salt) 
	VALUES ('daniel@test.com','Daniel', '98469af86bcb13b52c46a869aae043bd7a12c0b2886775b29b28ae128c9d2f04', '22cdb88d4a43bd58');
INSERT INTO "users"(email, name, hash, salt) 
	VALUES ('gabriele@test.com','Gabriele', 'c78dc3d6ad9cdee5fe61f1de5aa461786aea36c339a3dfa4bd4ea035249f7fb7', '70e59f79ddffc994');
INSERT INTO "users"(email, name, hash, salt) 
	VALUES ('gianmarco@test.com','Gianmarco', '01147dcb6106d9f60935ad5ca8558d6505bf0b7f9f0bf739ed5bf0ed043c01ac', '1638057386609ece');
	
	
INSERT INTO "films" VALUES(15, "Film1", 1, NULL, 0, 13);
INSERT INTO "films" VALUES(16, "Film2", 0, "2023-05-31", 2, 13);
INSERT INTO "films" VALUES(17, "Film3", 1, NULL, 0, 13);
INSERT INTO "films" VALUES(18, "Film2", 1, "2023-05-26", 5, 14);

COMMIT;
