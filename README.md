# Red Store - Enterprise Point of Sale & Inventory Management System

A distributed, real-time Point of Sale and inventory management system built for retail environments, featuring multi-device synchronization, event-driven architecture, and high-performance caching.

## 🏗️ System Architecture

Red Store is built as a microservices architecture with event-driven communication, designed to handle concurrent operations across multiple iPad terminals while maintaining data consistency and real-time synchronization.

### Core Services
- **Streaming Service** - Apache Kafka event streaming platform with custom partitioning
- **Consumer Service** - Message processing and database operations
- **Producer Service** - Sales and inventory event publishing
- **Cache Layer** - Redis-based caching and pub/sub messaging
- **Database Layer** - PostgreSQL with TimescaleDB for analytics

## 🚀 Key Features

### Real-Time Multi-Device Synchronization
- Concurrent sales processing across multiple iPad terminals
- Instant inventory updates with zero conflicts
- Server-Sent Events (SSE) for real-time UI updates

### Event-Driven Architecture
- Apache Kafka message streaming with custom partitioning logic
- Automatic topic discovery and consumer group management
- BullMQ job queues for asynchronous processing

### High-Performance Caching
- Redis pipeline operations for optimized performance
- Pub/Sub messaging for instant synchronization
- Strategic cache invalidation and updates

### Analytics & Reporting
- TimescaleDB integration for time-series data
- Real-time sales analytics and reporting
- Historical transaction tracking

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with REST APIs
- **Message Queue**: Apache Kafka
- **Cache**: Redis with pub/sub
- **Job Queue**: BullMQ
- **Database**: PostgreSQL (Supabase) + TimescaleDB

### Architecture Patterns
- Microservices Architecture
- Event-Driven Design
- CQRS (Command Query Responsibility Segregation)
- Publisher-Subscriber Pattern

## 📱 Multi-Device Setup

The system is designed for iPad terminals but supports any web-capable device:

1. Configure store-specific partitioning
2. Set up device-specific consumer groups
3. Enable real-time SSE connections
4. Configure Redis pub/sub channels

## 🔐 Security Features

- Store-specific data isolation through partitioning
- User-based topic segregation
- Redis channel-based access control
- Database row-level security policies

## 📈 Scalability

The system architecture supports:
- Horizontal scaling through Kafka partitioning
- Multiple consumer groups for load distribution
- Redis clustering for cache scaling
- Database sharding through store-based partitioning
