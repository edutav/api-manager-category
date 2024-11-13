
CREATE TABLE public.categories (
	id serial4 NOT NULL,
	name varchar NOT NULL,
	"isActive" bool NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"parentId" int4 NULL,
	CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id),
	CONSTRAINT "UQ_a1c9067a5e8b5aa4b5a9b357ec0" UNIQUE ("parentId", name),
	CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES public.categories(id) ON DELETE CASCADE
);