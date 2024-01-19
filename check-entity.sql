-- public.category_sticker definition

-- Drop table

-- DROP TABLE public.category_sticker;

CREATE TABLE public.category_sticker (
	id serial4 NOT NULL,
	"timestamp" timestamp NOT NULL DEFAULT now(),
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	owner_id int8 NULL,
	CONSTRAINT "PK_9787809e1a941085ed50a1b2702" PRIMARY KEY (id)
);


-- public.conversation definition

-- Drop table

-- DROP TABLE public.conversation;

CREATE TABLE public.conversation (
	id serial4 NOT NULL,
	"timestamp" timestamp NOT NULL DEFAULT now(),
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	"name" varchar NULL,
	avatar text NULL,
	"type" int2 NOT NULL,
	members _int8 NOT NULL,
	background text NULL,
	no_of_member int2 NOT NULL,
	link_join varchar NULL,
	is_confirm_new_member int2 NOT NULL DEFAULT '0'::smallint,
	is_join_with_link int2 NOT NULL DEFAULT '1'::smallint,
	is_send_message int2 NOT NULL DEFAULT '1'::smallint,
	last_message_id int8 NULL,
	last_activity float8 NULL,
	status int2 NOT NULL DEFAULT '1'::smallint,
	CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY (id)
);


-- public.conversation_member definition

-- Drop table

-- DROP TABLE public.conversation_member;

CREATE TABLE public.conversation_member (
	id serial4 NOT NULL,
	"timestamp" timestamp NOT NULL DEFAULT now(),
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	conversation_id int8 NOT NULL,
	user_id int8 NOT NULL,
	"permission" int2 NOT NULL,
	message_pre_id int8 NOT NULL DEFAULT '0'::bigint,
	message_last_id int8 NOT NULL DEFAULT '0'::bigint,
	CONSTRAINT "PK_ed07d3bc360f4e68836841b8358" PRIMARY KEY (id)
);


-- public.conversation_member_waiting_confirm definition

-- Drop table

-- DROP TABLE public.conversation_member_waiting_confirm;

CREATE TABLE public.conversation_member_waiting_confirm (
	id serial4 NOT NULL,
	"timestamp" timestamp NOT NULL DEFAULT now(),
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	conversation_id int8 NOT NULL,
	user_id int8 NOT NULL,
	CONSTRAINT "PK_6f71e1430c908e5d890d8d81d35" PRIMARY KEY (id)
);


-- public.message definition

-- Drop table

-- DROP TABLE public.message;

CREATE TABLE public.message (
	id serial4 NOT NULL,
	"timestamp" timestamp NOT NULL DEFAULT now(),
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	conversation_id int8 NOT NULL,
	user_id int8 NOT NULL,
	user_target json NULL,
	message text NULL,
	media text NULL,
	sticker json NULL,
	no_of_reaction int4 NOT NULL DEFAULT 0,
	message_reply_id int8 NULL,
	"type" int2 NOT NULL,
	status int2 NOT NULL DEFAULT '1'::smallint,
	CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY (id)
);


-- public.sticker definition

-- Drop table

-- DROP TABLE public.sticker;

CREATE TABLE public.sticker (
	id serial4 NOT NULL,
	"timestamp" timestamp NOT NULL DEFAULT now(),
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	media text NOT NULL,
	tag _varchar NOT NULL,
	CONSTRAINT "PK_1b0fb7dd0687505955f184cfcb1" PRIMARY KEY (id)
);


-- public."user" definition

-- Drop table

-- DROP TABLE public."user";

CREATE TABLE public."user" (
	id serial4 NOT NULL,
	"timestamp" timestamp NOT NULL DEFAULT now(),
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	avatar varchar NULL,
	full_name varchar NOT NULL,
	nick_name varchar NULL,
	address varchar NULL,
	cover text NULL,
	phone varchar NOT NULL,
	gender int2 NOT NULL DEFAULT '0'::smallint,
	birthday varchar NULL,
	description text NULL,
	email varchar NULL,
	last_connect timestamp NULL,
	status int2 NOT NULL DEFAULT '1'::smallint,
	CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id)
);