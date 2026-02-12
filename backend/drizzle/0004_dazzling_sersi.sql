CREATE TABLE `archive_item_figures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`archive_item_id` int NOT NULL,
	`figure_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `archive_item_figures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collaborations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name_en` varchar(200) NOT NULL,
	`name_ar` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`description_en` text,
	`description_ar` text,
	`logo_url` varchar(500),
	`website_url` varchar(500),
	`internal_link` varchar(500),
	`category` varchar(100),
	`status` enum('draft','review','published') NOT NULL DEFAULT 'draft',
	`is_featured` boolean NOT NULL DEFAULT false,
	`author_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`published_at` timestamp,
	CONSTRAINT `collaborations_id` PRIMARY KEY(`id`),
	CONSTRAINT `collaborations_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `event_figures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event_id` int NOT NULL,
	`figure_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_figures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_reposts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event_id` int NOT NULL,
	`repost_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_reposts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `families` (
	`id` int AUTO_INCREMENT NOT NULL,
	`section_id` int NOT NULL,
	`name_en` varchar(200) NOT NULL,
	`name_ar` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`note_en` text,
	`note_ar` text,
	`period` varchar(200),
	`overview_en` text,
	`overview_ar` text,
	`tree_structure` json,
	`status` enum('draft','review','published') NOT NULL DEFAULT 'draft',
	`author_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`published_at` timestamp,
	CONSTRAINT `families_id` PRIMARY KEY(`id`),
	CONSTRAINT `families_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `family_tree_sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title_en` varchar(200) NOT NULL,
	`title_ar` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`description_en` text,
	`description_ar` text,
	`image_url` varchar(500),
	`order` int NOT NULL DEFAULT 0,
	`status` enum('draft','review','published') NOT NULL DEFAULT 'draft',
	`author_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`published_at` timestamp,
	CONSTRAINT `family_tree_sections_id` PRIMARY KEY(`id`),
	CONSTRAINT `family_tree_sections_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `ferjan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name_en` varchar(200) NOT NULL,
	`name_ar` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`description_en` text,
	`description_ar` text,
	`overview_image_url` varchar(500),
	`timeline_entries` json,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`tags` json,
	`status` enum('draft','review','published') NOT NULL DEFAULT 'draft',
	`is_featured` boolean NOT NULL DEFAULT false,
	`author_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`published_at` timestamp,
	CONSTRAINT `ferjan_id` PRIMARY KEY(`id`),
	CONSTRAINT `ferjan_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `figure_history_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`figure_id` int NOT NULL,
	`history_entry_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `figure_history_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `figures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name_en` varchar(200) NOT NULL,
	`name_ar` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`bio_en` text,
	`bio_ar` text,
	`role_en` varchar(200),
	`role_ar` varchar(200),
	`photo_url` varchar(500),
	`period` varchar(200),
	`birth_year` int,
	`death_year` int,
	`family_id` int,
	`position_in_tree` varchar(200),
	`place_id` int,
	`place_en` varchar(200),
	`place_ar` varchar(200),
	`tags` json,
	`status` enum('draft','review','published') NOT NULL DEFAULT 'draft',
	`is_featured` boolean NOT NULL DEFAULT false,
	`author_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`published_at` timestamp,
	CONSTRAINT `figures_id` PRIMARY KEY(`id`),
	CONSTRAINT `figures_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `history_archive_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`history_entry_id` int NOT NULL,
	`archive_item_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `history_archive_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `history_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`history_entry_id` int NOT NULL,
	`photo_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `history_photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `history_poems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`history_entry_id` int NOT NULL,
	`poem_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `history_poems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `photo_figures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`photo_id` int NOT NULL,
	`figure_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `photo_figures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `reposts` MODIFY COLUMN `source_url` varchar(500);--> statement-breakpoint
ALTER TABLE `archive_items` ADD `document_type` varchar(100);--> statement-breakpoint
ALTER TABLE `archive_items` ADD `period` varchar(200);--> statement-breakpoint
ALTER TABLE `archive_items` ADD `place_id` int;--> statement-breakpoint
ALTER TABLE `books` ADD `figure_id` int;--> statement-breakpoint
ALTER TABLE `events` ADD `place_id` int;--> statement-breakpoint
ALTER TABLE `history_entries` ADD `period` varchar(200);--> statement-breakpoint
ALTER TABLE `history_entries` ADD `place_id` int;--> statement-breakpoint
ALTER TABLE `photos` ADD `photo_category` enum('place','person','event','tribe','other','unknown');--> statement-breakpoint
ALTER TABLE `photos` ADD `period` varchar(200);--> statement-breakpoint
ALTER TABLE `photos` ADD `place_id` int;--> statement-breakpoint
ALTER TABLE `poems` ADD `figure_id` int;--> statement-breakpoint
ALTER TABLE `poems` ADD `period` varchar(200);--> statement-breakpoint
ALTER TABLE `poems` ADD `place_id` int;--> statement-breakpoint
ALTER TABLE `reposts` ADD `caption_en` text;--> statement-breakpoint
ALTER TABLE `reposts` ADD `caption_ar` text;--> statement-breakpoint
ALTER TABLE `reposts` ADD `source_type` enum('instagram','twitter','facebook','manual','other') NOT NULL;--> statement-breakpoint
ALTER TABLE `reposts` ADD `media_url` varchar(500);--> statement-breakpoint
ALTER TABLE `reposts` ADD `media_type` enum('image','video','carousel');--> statement-breakpoint
ALTER TABLE `reposts` ADD `place_id` int;--> statement-breakpoint
ALTER TABLE `reposts` ADD `figure_id` int;