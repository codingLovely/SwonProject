CREATE DATABASE  IF NOT EXISTS `tb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tb`;
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: tb
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_s10_code`
--

DROP TABLE IF EXISTS `tb_s10_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_s10_code` (
  `CD_TP` text,
  `CD_V` text,
  `CREATED_DATE` datetime DEFAULT NULL,
  `CREATED_PROGRAM_ID` text,
  `LAST_UPDATE_DATE` datetime DEFAULT NULL,
  `LAST_UPDATE_PROGRAM_ID` text,
  `CD_TP_MEANING` text,
  `CD_V_MEANING` text,
  `ATTRIBUTE1` text,
  `ATTRIBUTE2` text,
  `ATTRIBUTE3` text,
  `ATTRIBUTE4` text,
  `ATTRIBUTE5` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_s10_code`
--

LOCK TABLES `tb_s10_code` WRITE;
/*!40000 ALTER TABLE `tb_s10_code` DISABLE KEYS */;
INSERT INTO `tb_s10_code` VALUES ('MEMBER_TP','R','0000-00-00 00:00:00','','0000-00-00 00:00:00','','회원구분','법인','','','','',''),('MEMBER_TP','P','0000-00-00 00:00:00','','0000-00-00 00:00:00','','회원구분','개인','','','','',''),('MEMBER_TP','F','0000-00-00 00:00:00','','0000-00-00 00:00:00','','회원구분','프리랜서','','','','',''),('MEMBER_ST','C','0000-00-00 00:00:00','','0000-00-00 00:00:00','','회원상태','확정','','','','',''),('MEMBER_ST','T','0000-00-00 00:00:00','','0000-00-00 00:00:00','','회원상태','가계약','','','','',''),('CONTRACT_TP','R1','0000-00-00 00:00:00','','0000-00-00 00:00:00','','계약구분','1인실','CONTRACT','ASK','','',''),('CONTRACT_TP','R2','0000-00-00 00:00:00','','0000-00-00 00:00:00','','계약구분','2인실','CONTRACT','ASK','','',''),('CONTRACT_TP','R3','0000-00-00 00:00:00','','0000-00-00 00:00:00','','계약구분','3인실','CONTRACT','ASK','','',''),('CONTRACT_TP','FI','0000-00-00 00:00:00','','0000-00-00 00:00:00','','계약구분','고정석','CONTRACT','ASK','','',''),('CONTRACT_TP','FL','0000-00-00 00:00:00','','0000-00-00 00:00:00','','계약구분','자유석','CONTRACT','ASK','','',''),('CONTRACT_TP','FR','0000-00-00 00:00:00','','0000-00-00 00:00:00','','계약구분','비상주','CONTRACT','ASK','','',''),('CONTRACT_TP','ET','0000-00-00 00:00:00','','0000-00-00 00:00:00','','계약구분','기타','','ASK','','',''),('EMP_TP','R','0000-00-00 00:00:00','','0000-00-00 00:00:00','','직원구분','정규직','','','','',''),('EMP_TP','C','0000-00-00 00:00:00','','0000-00-00 00:00:00','','직원구분','계약직','','','','',''),('ROOM_LOCKER_TP','L','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함호실구분','사물함','','','','',''),('ROOM_LOCKER_TP','R','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함호실구분','ROOM','','','','',''),('PAY_METHOD','MO','0000-00-00 00:00:00','','0000-00-00 00:00:00','','납부방법','월납','','','','',''),('PAY_METHOD','SI','0000-00-00 00:00:00','','0000-00-00 00:00:00','','납부방법','일시불','','','','',''),('ACCESS_PATH','A','0000-00-00 00:00:00','','0000-00-00 00:00:00','','접근경로','블로그','CONTRACT','ASK','','',''),('ACCESS_PATH','B','0000-00-00 00:00:00','','0000-00-00 00:00:00','','접근경로','페이스북','CONTRACT','ASK','','',''),('ACCESS_PATH','C','0000-00-00 00:00:00','','0000-00-00 00:00:00','','접근경로','인스타','CONTRACT','ASK','','',''),('ACCESS_PATH','D','0000-00-00 00:00:00','','0000-00-00 00:00:00','','접근경로','유튜브','CONTRACT','ASK','','',''),('ACCESS_PATH','E','0000-00-00 00:00:00','','0000-00-00 00:00:00','','접근경로','파워링크','CONTRACT','ASK','','',''),('ACCESS_PATH','F','0000-00-00 00:00:00','','0000-00-00 00:00:00','','접근경로','지도검색','CONTRACT','ASK','','',''),('ACCESS_PATH','G','0000-00-00 00:00:00','','0000-00-00 00:00:00','','접근경로','지인소개','CONTRACT','ASK','','',''),('ACCESS_PATH','H','0000-00-00 00:00:00','','0000-00-00 00:00:00','','접근경로','재계약','CONTRACT','','','',''),('ACCESS_PATH','J','0000-00-00 00:00:00','','0000-00-00 00:00:00','','접근경로','기타','CONTRACT','ASK','','',''),('ASK_METHOD','A','0000-00-00 00:00:00','','0000-00-00 00:00:00','','문의방법','유선','','','','',''),('ASK_METHOD','B','0000-00-00 00:00:00','','0000-00-00 00:00:00','','문의방법','메일','','','','',''),('ASK_METHOD','C','0000-00-00 00:00:00','','0000-00-00 00:00:00','','문의방법','게시판','','','','',''),('ASK_METHOD','D','0000-00-00 00:00:00','','0000-00-00 00:00:00','','문의방법','카카오플러스친구','','','','',''),('ASK_METHOD','E','0000-00-00 00:00:00','','0000-00-00 00:00:00','','문의방법','네이버톡톡','','','','',''),('ASK_METHOD','F','0000-00-00 00:00:00','','0000-00-00 00:00:00','','문의방법','기타','','','','',''),('R1','R1_301','0000-00-00 00:00:00','','0000-00-00 00:00:00','','1인실','301호','층수','계약ID','100000','',''),('R1','R1_401','0000-00-00 00:00:00','','0000-00-00 00:00:00','','1인실','401호','4층','','100000','',''),('R1','R1_402','0000-00-00 00:00:00','','0000-00-00 00:00:00','','1인실','402호','4층','','100000','',''),('R1','R1_403','0000-00-00 00:00:00','','0000-00-00 00:00:00','','1인실','403호','4층','','100000','',''),('R1','R1_404','0000-00-00 00:00:00','','0000-00-00 00:00:00','','1인실','404호','4층','','100000','',''),('R1','R1_405','0000-00-00 00:00:00','','0000-00-00 00:00:00','','1인실','405호','4층','','100000','',''),('R1','R1_406','0000-00-00 00:00:00','','0000-00-00 00:00:00','','1인실','406호','4층','','100000','',''),('R1','R1_407','0000-00-00 00:00:00','','0000-00-00 00:00:00','','1인실','407호','4층','','100000','',''),('R1','R1_408','0000-00-00 00:00:00','','0000-00-00 00:00:00','','1인실','408호','4층','','100000','',''),('R2','R2_302','0000-00-00 00:00:00','','0000-00-00 00:00:00','','2인실','302호','3층','','200000','',''),('R2','R2_409','0000-00-00 00:00:00','','0000-00-00 00:00:00','','2인실','409호','4층','','200000','',''),('R2','R2_410','0000-00-00 00:00:00','','0000-00-00 00:00:00','','2인실','410호','4층','','200000','',''),('R2','R2_411','0000-00-00 00:00:00','','0000-00-00 00:00:00','','2인실','411호','4층','','200000','',''),('R2','R2_412','0000-00-00 00:00:00','','0000-00-00 00:00:00','','2인실','412호','4층','','200000','',''),('R3','R3_303','0000-00-00 00:00:00','','0000-00-00 00:00:00','','3인실','303호','3층','','300000','',''),('R3','R3_413','0000-00-00 00:00:00','','0000-00-00 00:00:00','','3인실','413호','4층','','300000','',''),('R3','R3_414','0000-00-00 00:00:00','','0000-00-00 00:00:00','','3인실','414호','4층','','300000','',''),('FI','FI_301','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','304호','3층','','50000','',''),('FI','FI_302','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','305호','3층','','50000','',''),('FI','FI_303','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','306호','3층','','50000','',''),('FI','FI_304','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','307호','3층','','50000','',''),('FI','FI_305','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','308호','3층','','50000','',''),('FI','FI_306','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','309호','3층','','50000','',''),('FI','FI_307','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','310호','3층','','50000','',''),('FI','FI_308','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','311호','3층','','50000','',''),('FI','FI_309','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','312호','3층','','50000','',''),('FI','FI_310','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','313호','3층','','50000','',''),('FI','FI_311','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','314호','3층','','50000','',''),('FI','FI_312','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','315호','3층','','50000','',''),('FI','FI_313','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','316호','3층','','50000','',''),('FI','FI_314','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','317호','3층','','50000','',''),('FI','FI_315','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','318호','3층','','50000','',''),('FI','FI_316','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','319호','3층','','50000','',''),('FI','FI_317','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','320호','3층','','50000','',''),('FI','FI_318','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','321호','3층','','50000','',''),('FI','FI_319','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','322호','3층','','50000','',''),('FI','FI_320','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','323호','3층','','50000','',''),('FI','FI_321','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','324호','3층','','50000','',''),('FI','FI_322','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','325호','3층','','50000','',''),('FI','FI_323','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','326호','3층','','50000','',''),('FI','FI_324','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','327호','3층','','50000','',''),('FI','FI_325','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','328호','3층','','50000','',''),('FI','FI_326','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','329호','3층','','50000','',''),('FI','FI_327','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','330호','3층','','50000','',''),('FI','FI_401','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','415호','4층','','50000','',''),('FI','FI_402','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','416호','4층','','50000','',''),('FI','FI_403','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','417호','4층','','50000','',''),('FI','FI_404','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','418호','4층','','50000','',''),('FI','FI_405','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','419호','4층','','50000','',''),('FI','FI_406','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','420호','4층','','50000','',''),('FI','FI_407','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','421호','4층','','50000','',''),('FI','FI_408','0000-00-00 00:00:00','','0000-00-00 00:00:00','','고정석','422호','4층','','50000','',''),('FL','FL_301','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','331호','3층','','60000','',''),('FL','FL_302','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','332호','3층','','60000','',''),('FL','FL_303','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','333호','3층','','60000','',''),('FL','FL_304','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','334호','3층','','60000','',''),('FL','FL_305','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','335호','3층','','60000','',''),('FL','FL_306','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','336호','3층','','60000','',''),('FL','FL_307','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','337호','3층','','60000','',''),('FL','FL_308','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','338호','3층','','60000','',''),('FL','FL_309','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','339호','3층','','60000','',''),('FL','FL_310','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','340호','3층','','60000','',''),('FL','FL_311','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','341호','3층','','60000','',''),('FL','FL_312','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','342호','3층','','60000','',''),('FL','FL_313','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','343호','3층','','60000','',''),('FL','FL_314','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','344호','3층','','60000','',''),('FL','FL_315','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','345호','3층','','60000','',''),('FL','FL_316','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','346호','3층','','60000','',''),('FL','FL_317','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','347호','3층','','60000','',''),('FL','FL_318','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','348호','3층','','60000','',''),('FL','FL_319','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','349호','3층','','60000','',''),('FL','FL_320','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','350호','3층','','60000','',''),('FL','FL_321','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','351호','3층','','60000','',''),('FL','FL_322','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','352호','3층','','60000','',''),('FL','FL_323','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','353호','3층','','60000','',''),('FL','FL_324','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','354호','3층','','60000','',''),('FL','FL_325','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','355호','3층','','60000','',''),('FL','FL_326','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','356호','3층','','60000','',''),('FL','FL_327','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','357호','3층','','60000','',''),('FL','FL_401','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','423호','4층','','60000','',''),('FL','FL_402','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','424호','4층','','60000','',''),('FL','FL_403','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','425호','4층','','60000','',''),('FL','FL_404','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','426호','4층','','60000','',''),('FL','FL_405','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','427호','4층','','60000','',''),('FL','FL_406','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','428호','4층','','60000','',''),('FL','FL_407','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','429호','4층','','60000','',''),('FL','FL_408','0000-00-00 00:00:00','','0000-00-00 00:00:00','','자유석','430호','4층','','60000','',''),('FR','FR_3001','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3001호','3층','','30000','',''),('FR','FR_3002','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3002호','3층','','30000','',''),('FR','FR_3003','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3003호','3층','','30000','',''),('FR','FR_3004','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3004호','3층','','30000','',''),('FR','FR_3005','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3005호','3층','','30000','',''),('FR','FR_3006','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3006호','3층','','30000','',''),('FR','FR_3007','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3007호','3층','','30000','',''),('FR','FR_3008','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3008호','3층','','30000','',''),('FR','FR_3009','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3009호','3층','','30000','',''),('FR','FR_3010','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3010호','3층','','30000','',''),('FR','FR_3011','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3011호','3층','','30000','',''),('FR','FR_3012','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3012호','3층','','30000','',''),('FR','FR_3013','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3013호','3층','','30000','',''),('FR','FR_3014','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3014호','3층','','30000','',''),('FR','FR_3015','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3015호','3층','','30000','',''),('FR','FR_3016','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3016호','3층','','30000','',''),('FR','FR_3017','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3017호','3층','','30000','',''),('FR','FR_3018','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3018호','3층','','30000','',''),('FR','FR_3019','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3019호','3층','','30000','',''),('FR','FR_3020','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3020호','3층','','30000','',''),('FR','FR_3021','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3021호','3층','','30000','',''),('FR','FR_3022','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3022호','3층','','30000','',''),('FR','FR_3023','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3023호','3층','','30000','',''),('FR','FR_3024','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3024호','3층','','30000','',''),('FR','FR_3025','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3025호','3층','','30000','',''),('FR','FR_3026','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3026호','3층','','30000','',''),('FR','FR_3027','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3027호','3층','','30000','',''),('FR','FR_3028','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3028호','3층','','30000','',''),('FR','FR_3029','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3029호','3층','','30000','',''),('FR','FR_3030','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3030호','3층','','30000','',''),('FR','FR_3031','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3031호','3층','','30000','',''),('FR','FR_3032','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3032호','3층','','30000','',''),('FR','FR_3033','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3033호','3층','','30000','',''),('FR','FR_3034','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3034호','3층','','30000','',''),('FR','FR_3035','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3035호','3층','','30000','',''),('FR','FR_3036','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3036호','3층','','30000','',''),('FR','FR_3037','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3037호','3층','','30000','',''),('FR','FR_3038','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3038호','3층','','30000','',''),('FR','FR_3039','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3039호','3층','','30000','',''),('FR','FR_3040','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3040호','3층','','30000','',''),('FR','FR_3041','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3041호','3층','','30000','',''),('FR','FR_3042','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3042호','3층','','30000','',''),('FR','FR_3043','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3043호','3층','','30000','',''),('FR','FR_3044','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3044호','3층','','30000','',''),('FR','FR_3045','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3045호','3층','','30000','',''),('FR','FR_3046','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3046호','3층','','30000','',''),('FR','FR_3047','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3047호','3층','','30000','',''),('FR','FR_3048','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3048호','3층','','30000','',''),('FR','FR_3049','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3049호','3층','','30000','',''),('FR','FR_3050','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3050호','3층','','30000','',''),('FR','FR_3051','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3051호','3층','','30000','',''),('FR','FR_3052','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3052호','3층','','30000','',''),('FR','FR_3053','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3053호','3층','','30000','',''),('FR','FR_3054','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3054호','3층','','30000','',''),('FR','FR_3055','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3055호','3층','','30000','',''),('FR','FR_3056','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3056호','3층','','30000','',''),('FR','FR_3057','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3057호','3층','','30000','',''),('FR','FR_3058','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3058호','3층','','30000','',''),('FR','FR_3059','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3059호','3층','','30000','',''),('FR','FR_3060','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3060호','3층','','30000','',''),('FR','FR_3061','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3061호','3층','','30000','',''),('FR','FR_3062','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3062호','3층','','30000','',''),('FR','FR_3063','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3063호','3층','','30000','',''),('FR','FR_3064','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3064호','3층','','30000','',''),('FR','FR_3065','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3065호','3층','','30000','',''),('FR','FR_3066','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3066호','3층','','30000','',''),('FR','FR_3067','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3067호','3층','','30000','',''),('FR','FR_3068','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3068호','3층','','30000','',''),('FR','FR_3069','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3069호','3층','','30000','',''),('FR','FR_3070','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3070호','3층','','30000','',''),('FR','FR_3071','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3071호','3층','','30000','',''),('FR','FR_3072','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3072호','3층','','30000','',''),('FR','FR_3073','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3073호','3층','','30000','',''),('FR','FR_3074','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3074호','3층','','30000','',''),('FR','FR_3075','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3075호','3층','','30000','',''),('FR','FR_3076','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3076호','3층','','30000','',''),('FR','FR_3077','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3077호','3층','','30000','',''),('FR','FR_3078','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3078호','3층','','30000','',''),('FR','FR_3079','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3079호','3층','','30000','',''),('FR','FR_3080','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3080호','3층','','30000','',''),('FR','FR_3081','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3081호','3층','','30000','',''),('FR','FR_3082','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3082호','3층','','30000','',''),('FR','FR_3083','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3083호','3층','','30000','',''),('FR','FR_3084','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3084호','3층','','30000','',''),('FR','FR_3085','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3085호','3층','','30000','',''),('FR','FR_3086','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3086호','3층','','30000','',''),('FR','FR_3087','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3087호','3층','','30000','',''),('FR','FR_3088','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3088호','3층','','30000','',''),('FR','FR_3089','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3089호','3층','','30000','',''),('FR','FR_3090','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3090호','3층','','30000','',''),('FR','FR_3091','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3091호','3층','','30000','',''),('FR','FR_3092','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3092호','3층','','30000','',''),('FR','FR_3093','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3093호','3층','','30000','',''),('FR','FR_3094','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3094호','3층','','30000','',''),('FR','FR_3095','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3095호','3층','','30000','',''),('FR','FR_3096','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3096호','3층','','30000','',''),('FR','FR_3097','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3097호','3층','','30000','',''),('FR','FR_3098','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3098호','3층','','30000','',''),('FR','FR_3099','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3099호','3층','','30000','',''),('FR','FR_3100','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3100호','3층','','30000','',''),('FR','FR_3101','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3101호','3층','','30000','',''),('FR','FR_3102','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3102호','3층','','30000','',''),('FR','FR_3103','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3103호','3층','','30000','',''),('FR','FR_3104','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3104호','3층','','30000','',''),('FR','FR_3105','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3105호','3층','','30000','',''),('FR','FR_3106','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3106호','3층','','30000','',''),('FR','FR_3107','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3107호','3층','','30000','',''),('FR','FR_3108','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3108호','3층','','30000','',''),('FR','FR_3109','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3109호','3층','','30000','',''),('FR','FR_3110','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3110호','3층','','30000','',''),('FR','FR_3111','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3111호','3층','','30000','',''),('FR','FR_3112','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3112호','3층','','30000','',''),('FR','FR_3113','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3113호','3층','','30000','',''),('FR','FR_3114','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3114호','3층','','30000','',''),('FR','FR_3115','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3115호','3층','','30000','',''),('FR','FR_3116','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3116호','3층','','30000','',''),('FR','FR_3117','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3117호','3층','','30000','',''),('FR','FR_3118','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3118호','3층','','30000','',''),('FR','FR_3119','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3119호','3층','','30000','',''),('FR','FR_3120','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3120호','3층','','30000','',''),('FR','FR_3121','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3121호','3층','','30000','',''),('FR','FR_3122','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3122호','3층','','30000','',''),('FR','FR_3123','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3123호','3층','','30000','',''),('FR','FR_3124','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3124호','3층','','30000','',''),('FR','FR_3125','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3125호','3층','','30000','',''),('FR','FR_3126','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3126호','3층','','30000','',''),('FR','FR_3127','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3127호','3층','','30000','',''),('FR','FR_3128','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3128호','3층','','30000','',''),('FR','FR_3129','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3129호','3층','','30000','',''),('FR','FR_3130','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3130호','3층','','30000','',''),('FR','FR_3131','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3131호','3층','','30000','',''),('FR','FR_3132','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3132호','3층','','30000','',''),('FR','FR_3133','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3133호','3층','','30000','',''),('FR','FR_3134','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3134호','3층','','30000','',''),('FR','FR_3135','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3135호','3층','','30000','',''),('FR','FR_3136','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3136호','3층','','30000','',''),('FR','FR_3137','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3137호','3층','','30000','',''),('FR','FR_3138','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3138호','3층','','30000','',''),('FR','FR_3139','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3139호','3층','','30000','',''),('FR','FR_3140','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3140호','3층','','30000','',''),('FR','FR_3141','0000-00-00 00:00:00','','0000-00-00 00:00:00','','비상주','3141호','3층','','30000','',''),('L','L_301','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','1','3층','패스워드','계약ID','27',''),('L','L_302','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','2','3층','','','20',''),('L','L_303','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','3','3층','','','',''),('L','L_304','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','4','3층','','','',''),('L','L_305','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','5','3층','','','',''),('L','L_306','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','6','3층','','','',''),('L','L_307','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','7','3층','','','',''),('L','L_308','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','8','3층','','','',''),('L','L_309','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','9','3층','','','',''),('L','L_310','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','10','3층','','','',''),('L','L_311','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','11','3층','','','',''),('L','L_312','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','12','3층','','','',''),('L','L_313','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','13','3층','','','',''),('L','L_314','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','14','3층','','','',''),('L','L_315','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','15','3층','','','',''),('L','L_316','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','16','3층','','','',''),('L','L_317','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','17','3층','','','',''),('L','L_318','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','18','3층','','','',''),('L','L_319','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','19','3층','','','',''),('L','L_320','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','20','3층','','','',''),('L','L_321','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','21','3층','','','',''),('L','L_322','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','22','3층','','','',''),('L','L_323','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','23','3층','','','',''),('L','L_324','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','24','3층','','','',''),('L','L_325','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','25','3층','','','',''),('L','L_326','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','26','3층','','','',''),('L','L_327','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','27','3층','','','',''),('L','L_328','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','28','3층','','','',''),('L','L_329','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','29','3층','','','',''),('L','L_330','0000-00-00 00:00:00','','0000-00-00 00:00:00','','사물함','30','3층','','','','');
/*!40000 ALTER TABLE `tb_s10_code` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-05 22:35:44