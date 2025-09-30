# Phase 5: Social Features & Competition

## Overview
Phase 5 introduces social elements, leaderboards, and competitive features to create community engagement and motivation through peer comparison.

## Completed Features

### 1. Global Leaderboard System
**File**: `src/components/Leaderboard.tsx`
- Real-time player rankings by XP
- Top 100 players display
- Current player position highlight
- Daily/weekly/all-time filters
- Supabase integration for live data

### 2. Friend System
**File**: `src/components/FriendsList.tsx`
- Add friends by username/email
- Friend request system
- Accept/decline invitations
- View friend profiles and progress
- Friend activity feed

### 3. Challenge System
**File**: `src/components/ChallengeCenter.tsx`
- Send challenges to friends
- Challenge types: Speed Run, High Score, Specific Game
- Challenge notifications
- Challenge history and stats
- Rewards for winning challenges

### 4. Achievement Sharing
**File**: `src/components/AchievementShare.tsx`
- Share achievements to social media
- Copy shareable achievement links
- Achievement showcase page
- Visual achievement cards
- Social media preview optimization

### 5. Player Profiles
**File**: `src/components/PlayerProfile.tsx`
- Public profile pages
- Skill radar chart
- Achievement gallery
- Recent activity timeline
- Statistics dashboard
- Privacy settings

### 6. Guild/Team System
**File**: `src/components/GuildSystem.tsx`
- Create and join guilds
- Guild chat and messaging
- Guild challenges and competitions
- Guild level and XP pool
- Guild perks and bonuses
- Guild leaderboard

## Database Schema Updates

### New Tables

#### `leaderboard`
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to profiles)
- username (text)
- total_xp (integer)
- level (integer)
- rank (integer)
- last_updated (timestamp)
```

#### `friendships`
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to profiles)
- friend_id (uuid, foreign key to profiles)
- status (enum: pending, accepted, declined)
- created_at (timestamp)
```

#### `challenges`
```sql
- id (uuid, primary key)
- challenger_id (uuid, foreign key to profiles)
- challenged_id (uuid, foreign key to profiles)
- game_id (text)
- challenge_type (text)
- status (enum: pending, active, completed, expired)
- winner_id (uuid, nullable)
- created_at (timestamp)
- expires_at (timestamp)
```

#### `guilds`
```sql
- id (uuid, primary key)
- name (text, unique)
- description (text)
- leader_id (uuid, foreign key to profiles)
- member_count (integer)
- total_xp (integer)
- level (integer)
- created_at (timestamp)
```

#### `guild_members`
```sql
- id (uuid, primary key)
- guild_id (uuid, foreign key to guilds)
- user_id (uuid, foreign key to profiles)
- role (enum: leader, officer, member)
- joined_at (timestamp)
```

## API/Edge Functions

### `get-leaderboard`
- Fetches top players with filters
- Caches results for performance
- Returns user's rank position

### `send-friend-request`
- Creates friendship record
- Sends notification to target user
- Validates user exists

### `create-challenge`
- Creates challenge record
- Notifies challenged player
- Sets expiration time

### `create-guild`
- Creates new guild
- Validates name uniqueness
- Sets founder as leader

## Integration Points

### With Existing Systems
- **Player Store**: Extended with social data
- **Achievement System**: Added sharing capabilities
- **Game Store**: Challenge tracking integration
- **Analytics**: Social interaction tracking

### New Hooks
- `useSocialStore`: Manages friend and guild state
- `useLeaderboard`: Fetches and caches leaderboard data
- `useChallenges`: Handles challenge operations

## UI/UX Enhancements

### New Navigation Items
- Leaderboard tab in sidebar
- Friends list in profile menu
- Challenge notifications icon
- Guild tab (when member of guild)

### New Screens
- `/leaderboard` - Global rankings
- `/profile/:userId` - Public profiles
- `/challenges` - Challenge center
- `/guild/:guildId` - Guild page

## Testing Completed

### Unit Tests
- Friend request flow
- Challenge creation and completion
- Leaderboard ranking algorithm
- Guild XP calculation

### Integration Tests
- Social feature database operations
- Real-time leaderboard updates
- Challenge notification delivery
- Guild member management

## Performance Optimizations

### Caching Strategy
- Leaderboard cached for 5 minutes
- Friend list cached until mutation
- Guild data cached with invalidation

### Database Indexes
- Index on `total_xp` for leaderboard
- Index on `user_id` in friendships
- Composite index on `guild_id, user_id`

## Security Considerations

### Privacy Controls
- Profile visibility settings
- Friend request filtering
- Challenge opt-out option
- Guild privacy modes

### Data Protection
- RLS policies for all social tables
- User can only modify own data
- Guild officers have limited permissions
- Friend requests require mutual consent

## Future Enhancements

### Planned Features
- Guild wars and tournaments
- Weekly challenges with prizes
- Seasonal leaderboards
- Mentor/mentee system
- Team-based games
- Social achievements
- Player reputation system

### Potential Integrations
- Discord bot for notifications
- Twitch streaming integration
- Achievement NFTs (optional)
- Community events calendar

## Known Issues
- [ ] Leaderboard can be slow with 10k+ users
- [ ] Guild chat needs rate limiting
- [ ] Challenge notifications sometimes delayed

## Documentation
- Social features user guide created
- API documentation updated
- Database migration scripts ready
- Admin guide for moderation
