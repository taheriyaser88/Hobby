-- Insert initial data for Hobby Manager application

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('ADMIN', 'Administrator with full system access'),
('ORGANIZER', 'Event organizer with event management permissions'),
('PARTICIPANT', 'Event participant with basic permissions'),
('MODERATOR', 'Moderator with content management permissions'),
('USER', 'Regular user with basic permissions');

-- Insert default permissions
INSERT INTO permissions (name, description) VALUES
('CREATE_EVENT', 'Create new events'),
('EDIT_EVENT', 'Edit existing events'),
('DELETE_EVENT', 'Delete events'),
('VIEW_EVENT', 'View event details'),
('MANAGE_PARTICIPANTS', 'Manage event participants'),
('CREATE_TASK', 'Create new tasks'),
('EDIT_TASK', 'Edit existing tasks'),
('DELETE_TASK', 'Delete tasks'),
('VIEW_TASK', 'View task details'),
('ASSIGN_TASK', 'Assign tasks to users'),
('MANAGE_USERS', 'Manage user accounts'),
('MANAGE_ROLES', 'Manage user roles and permissions'),
('VIEW_ANALYTICS', 'View system analytics'),
('MANAGE_CATEGORIES', 'Manage event categories'),
('SEND_NOTIFICATIONS', 'Send notifications to users');

-- Assign permissions to roles
-- ADMIN role gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ADMIN';

-- ORGANIZER role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ORGANIZER' AND p.name IN (
    'CREATE_EVENT', 'EDIT_EVENT', 'DELETE_EVENT', 'VIEW_EVENT',
    'MANAGE_PARTICIPANTS', 'CREATE_TASK', 'EDIT_TASK', 'DELETE_TASK',
    'VIEW_TASK', 'ASSIGN_TASK', 'MANAGE_CATEGORIES', 'SEND_NOTIFICATIONS'
);

-- MODERATOR role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'MODERATOR' AND p.name IN (
    'VIEW_EVENT', 'VIEW_TASK', 'MANAGE_PARTICIPANTS', 'SEND_NOTIFICATIONS'
);

-- PARTICIPANT role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'PARTICIPANT' AND p.name IN (
    'VIEW_EVENT', 'VIEW_TASK'
);

-- USER role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'USER' AND p.name IN (
    'VIEW_EVENT', 'VIEW_TASK'
);

-- Insert default event categories
INSERT INTO event_categories (name, description) VALUES
('Sports', 'Physical activities and sports events'),
('Technology', 'Tech meetups, workshops, and conferences'),
('Arts & Culture', 'Art exhibitions, cultural events, and performances'),
('Education', 'Educational workshops, seminars, and courses'),
('Business', 'Business networking, conferences, and meetings'),
('Health & Wellness', 'Health-related events, fitness activities, and wellness programs'),
('Entertainment', 'Entertainment events, shows, and performances'),
('Social', 'Social gatherings, parties, and community events'),
('Gaming', 'Gaming tournaments, competitions, and gaming meetups'),
('Food & Drink', 'Culinary events, food tastings, and cooking classes');

-- Insert default tags
INSERT INTO tags (name, color) VALUES
('urgent', '#FF6B6B'),
('important', '#4ECDC4'),
('beginner-friendly', '#45B7D1'),
('advanced', '#96CEB4'),
('free', '#FFEAA7'),
('paid', '#DDA0DD'),
('online', '#98D8C8'),
('offline', '#F7DC6F'),
('weekend', '#BB8FCE'),
('weekday', '#85C1E9');

-- Insert default labels
INSERT INTO labels (name, color) VALUES
('featured', '#FF6B6B'),
('new', '#4ECDC4'),
('popular', '#45B7D1'),
('trending', '#96CEB4'),
('limited', '#FFEAA7'),
('exclusive', '#DDA0DD'),
('community', '#98D8C8'),
('professional', '#F7DC6F'),
('casual', '#BB8FCE'),
('formal', '#85C1E9');
