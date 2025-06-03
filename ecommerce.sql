/*
 Navicat Premium Data Transfer

 Source Server         : Mysql
 Source Server Type    : MySQL
 Source Server Version : 80011
 Source Host           : localhost:3306
 Source Schema         : ecommerce

 Target Server Type    : MySQL
 Target Server Version : 80011
 File Encoding         : 65001

 Date: 03/06/2025 13:37:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for addresses
-- ----------------------------
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `province` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `city` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `district` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `detail` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `is_default` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_index`(`user_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of addresses
-- ----------------------------
INSERT INTO `addresses` VALUES (1, 3, '15320039770', '15320039770', '北京市', '北京市', '东城区', '12', 1);

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NULL DEFAULT 1,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  `image` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `user_product`(`user_id`, `product_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 90 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cart
-- ----------------------------

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES (1, '手机');
INSERT INTO `categories` VALUES (2, '电脑');
INSERT INTO `categories` VALUES (3, '平板电脑');
INSERT INTO `categories` VALUES (4, '耳机');
INSERT INTO `categories` VALUES (5, '智能设备');

-- ----------------------------
-- Table structure for order_items
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `order_id`(`order_id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE,
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of order_items
-- ----------------------------
INSERT INTO `order_items` VALUES (5, 21, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (6, 22, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (7, 23, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (8, 24, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (9, 25, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (10, 26, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (11, 27, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (12, 28, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (13, 29, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (14, 30, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (15, 31, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (16, 32, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (17, 33, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (18, 34, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (19, 35, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (20, 36, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (21, 37, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (22, 38, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (23, 39, 2, 1, 12999.00);
INSERT INTO `order_items` VALUES (24, 40, 2, 1, 12999.00);
INSERT INTO `order_items` VALUES (25, 41, 2, 1, 12999.00);
INSERT INTO `order_items` VALUES (26, 42, 2, 1, 12999.00);
INSERT INTO `order_items` VALUES (27, 43, 2, 1, 12999.00);
INSERT INTO `order_items` VALUES (28, 44, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (29, 45, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (30, 46, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (31, 47, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (32, 48, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (33, 49, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (34, 50, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (35, 51, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (36, 52, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (37, 53, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (38, 54, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (39, 55, 2, 1, 12999.00);
INSERT INTO `order_items` VALUES (40, 56, 2, 1, 12999.00);
INSERT INTO `order_items` VALUES (41, 57, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (42, 58, 1, 1, 6999.00);
INSERT INTO `order_items` VALUES (43, 59, 1, 1, 6999.00);

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `order_no` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `total_amount` decimal(10, 2) NOT NULL,
  `address_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `paid_at` timestamp NULL DEFAULT NULL,
  `status` enum('pending','paid','shipped','completed','cancelled') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `order_no`(`order_no`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 59 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (2, 3, 'ORDER-1745675751509-7858', 0.00, 1, '2025-04-26 21:55:52', NULL, 'pending');
INSERT INTO `orders` VALUES (3, 3, 'ORDER-1745675760656-5088', 0.00, 1, '2025-04-26 21:56:01', NULL, 'pending');
INSERT INTO `orders` VALUES (4, 3, 'ORDER-1745675766205-8936', 0.00, 1, '2025-04-26 21:56:06', NULL, 'pending');
INSERT INTO `orders` VALUES (5, 3, 'ORDER-1745675766682-5411', 0.00, 1, '2025-04-26 21:56:07', NULL, 'pending');
INSERT INTO `orders` VALUES (6, 3, 'ORDER-1745675767113-3106', 0.00, 1, '2025-04-26 21:56:07', NULL, 'pending');
INSERT INTO `orders` VALUES (7, 3, 'ORDER-1745675767421-8077', 0.00, 1, '2025-04-26 21:56:07', NULL, 'pending');
INSERT INTO `orders` VALUES (8, 3, 'ORDER-1745675767657-0525', 0.00, 1, '2025-04-26 21:56:08', NULL, 'pending');
INSERT INTO `orders` VALUES (9, 3, 'ORDER-1745675767851-3328', 0.00, 1, '2025-04-26 21:56:08', NULL, 'pending');
INSERT INTO `orders` VALUES (10, 3, 'ORDER-1745675768024-8724', 0.00, 1, '2025-04-26 21:56:08', NULL, 'pending');
INSERT INTO `orders` VALUES (11, 3, 'ORDER-1745675768177-8771', 0.00, 1, '2025-04-26 21:56:08', NULL, 'pending');
INSERT INTO `orders` VALUES (12, 3, 'ORDER-1745676255082-5835', 0.00, 1, '2025-04-26 22:04:15', NULL, 'pending');
INSERT INTO `orders` VALUES (13, 3, 'ORDER-1745741272011-3875', 0.00, 1, '2025-04-27 16:07:52', NULL, 'pending');
INSERT INTO `orders` VALUES (16, 3, 'ORDER-1745744828100-5171', 0.00, 1, '2025-04-27 17:07:08', NULL, 'pending');
INSERT INTO `orders` VALUES (17, 3, 'ORDER-1745745924586-9804', 0.00, 1, '2025-04-27 17:25:25', NULL, 'pending');
INSERT INTO `orders` VALUES (18, 3, 'ORDER-1745746461160-1321', 0.00, 1, '2025-04-27 17:34:21', NULL, 'pending');
INSERT INTO `orders` VALUES (21, 3, '17458181726932832', 6999.00, 1, '2025-04-28 13:29:33', NULL, 'pending');
INSERT INTO `orders` VALUES (22, 3, '17458183886895921', 6999.00, 1, '2025-04-28 13:33:09', NULL, 'pending');
INSERT INTO `orders` VALUES (23, 3, '17458189067061130', 6999.00, 1, '2025-04-28 13:41:47', NULL, 'pending');
INSERT INTO `orders` VALUES (24, 3, '17458213291971297', 6999.00, 1, '2025-04-28 14:22:09', NULL, 'pending');
INSERT INTO `orders` VALUES (25, 3, 'ORD17458214419754307', 6999.00, 1, '2025-04-28 14:24:01', NULL, 'pending');
INSERT INTO `orders` VALUES (26, 3, 'ORD17458216672250401', 6999.00, 1, '2025-04-28 14:27:47', NULL, 'pending');
INSERT INTO `orders` VALUES (27, 3, 'ORD17458217279427760', 6999.00, 1, '2025-04-28 14:28:47', NULL, 'pending');
INSERT INTO `orders` VALUES (28, 3, 'ORD17458224107744258', 6999.00, 1, '2025-04-28 14:40:10', NULL, 'pending');
INSERT INTO `orders` VALUES (29, 3, 'ORD17458224688131485', 6999.00, 1, '2025-04-28 14:41:08', NULL, 'pending');
INSERT INTO `orders` VALUES (30, 3, 'ORD17458234527621943', 6999.00, 1, '2025-04-28 14:57:32', NULL, 'pending');
INSERT INTO `orders` VALUES (31, 3, 'ORD17458235563490308', 6999.00, 1, '2025-04-28 14:59:16', NULL, 'pending');
INSERT INTO `orders` VALUES (32, 3, 'ORD17458235613171318', 6999.00, 1, '2025-04-28 14:59:21', NULL, 'pending');
INSERT INTO `orders` VALUES (33, 3, 'ORD17458235645186392', 6999.00, 1, '2025-04-28 14:59:24', NULL, 'pending');
INSERT INTO `orders` VALUES (34, 3, 'ORD17458235749801443', 6999.00, 1, '2025-04-28 14:59:34', NULL, 'pending');
INSERT INTO `orders` VALUES (35, 3, 'ORD17458235887016200', 6999.00, 1, '2025-04-28 14:59:48', NULL, 'pending');
INSERT INTO `orders` VALUES (36, 3, 'ORD17458236255006761', 6999.00, 1, '2025-04-28 15:00:25', NULL, 'pending');
INSERT INTO `orders` VALUES (37, 3, 'ORD17458243323173292', 6999.00, 1, '2025-04-28 15:12:12', NULL, 'pending');
INSERT INTO `orders` VALUES (38, 3, 'ORD17458244440172347', 6999.00, 1, '2025-04-28 15:14:04', NULL, 'pending');
INSERT INTO `orders` VALUES (39, 3, 'ORD17458244623470449', 12999.00, 1, '2025-04-28 15:14:22', NULL, 'pending');
INSERT INTO `orders` VALUES (40, 3, 'ORD17458246282170261', 12999.00, 1, '2025-04-28 15:17:08', NULL, 'pending');
INSERT INTO `orders` VALUES (41, 3, 'ORD17458246465936427', 12999.00, 1, '2025-04-28 15:17:26', NULL, 'pending');
INSERT INTO `orders` VALUES (42, 3, 'ORD17458246818588229', 12999.00, 1, '2025-04-28 15:18:01', NULL, 'pending');
INSERT INTO `orders` VALUES (43, 3, 'ORD17458246904112272', 12999.00, 1, '2025-04-28 15:18:10', NULL, 'pending');
INSERT INTO `orders` VALUES (44, 3, 'ORD17458247355014151', 6999.00, 1, '2025-04-28 15:18:55', NULL, 'pending');
INSERT INTO `orders` VALUES (45, 3, 'ORD17458247865452589', 6999.00, 1, '2025-04-28 15:19:46', NULL, 'pending');
INSERT INTO `orders` VALUES (46, 3, 'ORD17458247914249568', 6999.00, 1, '2025-04-28 15:19:51', NULL, 'pending');
INSERT INTO `orders` VALUES (47, 3, 'ORD17458248618005246', 6999.00, 1, '2025-04-28 15:21:01', NULL, 'pending');
INSERT INTO `orders` VALUES (48, 3, 'ORD17458248767594607', 6999.00, 1, '2025-04-28 15:21:16', NULL, 'pending');
INSERT INTO `orders` VALUES (49, 3, 'ORD17458256322769999', 6999.00, 1, '2025-04-28 15:33:52', NULL, 'pending');
INSERT INTO `orders` VALUES (50, 3, 'ORD17458449145261611', 6999.00, 1, '2025-04-28 20:55:14', NULL, 'pending');
INSERT INTO `orders` VALUES (51, 3, 'ORD17458450372762225', 6999.00, 1, '2025-04-28 20:57:17', NULL, 'pending');
INSERT INTO `orders` VALUES (52, 3, 'ORD17458450415770929', 6999.00, 1, '2025-04-28 20:57:21', NULL, 'pending');
INSERT INTO `orders` VALUES (53, 3, 'ORD17458450567858267', 6999.00, 1, '2025-04-28 20:57:36', NULL, 'pending');
INSERT INTO `orders` VALUES (54, 3, 'ORD17458481216757726', 6999.00, 1, '2025-04-28 21:48:41', NULL, 'pending');
INSERT INTO `orders` VALUES (55, 3, 'ORD17458481997383690', 12999.00, 1, '2025-04-28 21:49:59', NULL, 'pending');
INSERT INTO `orders` VALUES (56, 3, 'ORD17458482252545596', 12999.00, 1, '2025-04-28 21:50:25', NULL, 'pending');
INSERT INTO `orders` VALUES (57, 3, 'ORD17458501163722598', 6999.00, 1, '2025-04-28 22:21:56', NULL, 'pending');
INSERT INTO `orders` VALUES (58, 3, 'ORD17458534998968450', 6999.00, 1, '2025-04-28 23:18:19', NULL, 'pending');
INSERT INTO `orders` VALUES (59, 3, 'ORD17458535052101553', 6999.00, 1, '2025-04-28 23:18:25', NULL, 'pending');

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `price` decimal(10, 2) NOT NULL,
  `image` varchar(512) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `category_id` int(11) NULL DEFAULT NULL,
  `stock` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (1, 'iPhone 16 Pro Max', '最新款苹果手机', 6999.00, '16pm.jpg', 1, 50);
INSERT INTO `products` VALUES (2, 'MacBook Pro', '高性能笔记本电脑', 12999.00, 'mbp.jpg', 2, 50);
INSERT INTO `products` VALUES (3, 'mate70', '遥遥领先', 6999.00, 'mate70.jpg', 1, 50);
INSERT INTO `products` VALUES (5, 'Samsung Galaxy S25 Ultra', '三星旗舰智能手机', 6499.00, 's25u.jpg', 1, 50);
INSERT INTO `products` VALUES (6, 'Xiaomi 14 Ultra', '小米高端影像手机', 4999.00, 'x14u.jpg', 1, 50);
INSERT INTO `products` VALUES (7, 'OnePlus 12', '一加高性能手机', 4499.00, 'op12.jpg', 1, 50);
INSERT INTO `products` VALUES (8, 'MacBook Air', '苹果轻薄笔记本电脑', 9999.00, 'mba.jpg', 2, 50);
INSERT INTO `products` VALUES (9, 'Dell XPS 13', '戴尔轻薄商务笔记本', 10999.00, 'dellxps13.jpg', 2, 50);
INSERT INTO `products` VALUES (10, 'Lenovo ThinkPad X1 Carbon', '联想商务旗舰本', 11999.00, 'tpX1c.jpg', 2, 50);
INSERT INTO `products` VALUES (11, 'Huawei MateBook X Pro', '华为高端轻薄本', 10499.00, 'mbxp.jpg', 2, 50);
INSERT INTO `products` VALUES (12, 'iPad Pro 2025', '苹果高性能平板电脑', 7999.00, 'ip25p.jpg', 3, 50);
INSERT INTO `products` VALUES (13, 'Samsung Galaxy Tab S10', '三星高端平板', 6999.00, 'sgtabs10.jpg', 3, 50);
INSERT INTO `products` VALUES (14, 'Microsoft Surface Pro 11', '微软二合一平板笔记本', 8999.00, 'sp11.jpg', 3, 50);
INSERT INTO `products` VALUES (15, 'Xiaomi Pad 7 Pro', '小米大屏娱乐平板', 3499.00, 'xpad7p.jpg', 3, 50);
INSERT INTO `products` VALUES (16, 'AirPods Pro 3', '苹果第三代降噪耳机', 1899.00, 'a3p.jpg', 4, 50);
INSERT INTO `products` VALUES (17, 'Sony WF-1000XM5', '索尼降噪蓝牙耳机', 1699.00, 'sonyxm5.jpg', 4, 50);
INSERT INTO `products` VALUES (18, 'Bose QuietComfort Earbuds II', '博士降噪耳塞二代', 1799.00, 'boseqc2.jpg', 4, 50);
INSERT INTO `products` VALUES (19, 'Xiaomi Buds 5 Pro', '小米降噪耳机Pro', 999.00, 'xb5p.jpg', 4, 50);
INSERT INTO `products` VALUES (20, 'Apple Watch Series 10', '苹果智能手表第十代', 3999.00, 'aw10.jpg', 5, 50);
INSERT INTO `products` VALUES (21, 'Samsung Galaxy Watch 7', '三星智能手表第七代', 3499.00, 'sgtw7.jpg', 5, 50);
INSERT INTO `products` VALUES (22, 'Huawei Watch GT 5', '华为运动智能手表', 1999.00, 'hwgt5.jpg', 5, 50);
INSERT INTO `products` VALUES (23, 'Xiaomi Watch S3', '小米时尚智能手表', 1299.00, 'xws3.jpg', 5, 50);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nickname` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `avatar_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `session_key` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (3, 'oyD2l7U-k-KbW02PPmn4X4agAi3s', '微信用户', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', '');

-- ----------------------------
-- Table structure for wallet
-- ----------------------------
DROP TABLE IF EXISTS `wallet`;
CREATE TABLE `wallet`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `balance` decimal(12, 2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of wallet
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
