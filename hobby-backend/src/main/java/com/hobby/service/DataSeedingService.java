package com.hobby.service;

import com.hobby.model.user.Role;
import com.hobby.model.user.Permission;
import com.hobby.model.event.EventCategory;
import com.hobby.model.tag.Tag;
import com.hobby.model.tag.Label;
import com.hobby.service.user.RoleService;
import com.hobby.service.user.PermissionService;
import com.hobby.service.event.EventCategoryService;
import com.hobby.service.tag.TagService;
import com.hobby.service.tag.LabelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@Transactional
public class DataSeedingService implements CommandLineRunner {

    @Autowired
    private RoleService roleService;

    @Autowired
    private PermissionService permissionService;

    @Autowired
    private EventCategoryService eventCategoryService;

    @Autowired
    private TagService tagService;

    @Autowired
    private LabelService labelService;

    @Override
    public void run(String... args) throws Exception {
        seedRoles();
        seedPermissions();
        seedEventCategories();
        seedTags();
        seedLabels();
    }

    private void seedRoles() {
        List<String> roleNames = Arrays.asList("ADMIN", "ORGANIZER", "PARTICIPANT", "MODERATOR", "USER");
        
        for (String roleName : roleNames) {
            if (!roleService.existsByName(roleName)) {
                String description = getRoleDescription(roleName);
                roleService.createRole(roleName, description);
            }
        }
    }

    private void seedPermissions() {
        List<String> permissionNames = Arrays.asList(
            "CREATE_EVENT", "EDIT_EVENT", "DELETE_EVENT", "VIEW_EVENT",
            "MANAGE_PARTICIPANTS", "CREATE_TASK", "EDIT_TASK", "DELETE_TASK",
            "VIEW_TASK", "ASSIGN_TASK", "MANAGE_USERS", "MANAGE_ROLES",
            "VIEW_ANALYTICS", "MANAGE_CATEGORIES", "SEND_NOTIFICATIONS"
        );
        
        for (String permissionName : permissionNames) {
            if (!permissionService.existsByName(permissionName)) {
                String description = getPermissionDescription(permissionName);
                permissionService.createPermission(permissionName, description);
            }
        }
    }

    private void seedEventCategories() {
        List<String[]> categories = Arrays.asList(
            new String[]{"Sports", "Physical activities and sports events"},
            new String[]{"Technology", "Tech meetups, workshops, and conferences"},
            new String[]{"Arts & Culture", "Art exhibitions, cultural events, and performances"},
            new String[]{"Education", "Educational workshops, seminars, and courses"},
            new String[]{"Business", "Business networking, conferences, and meetings"},
            new String[]{"Health & Wellness", "Health-related events, fitness activities, and wellness programs"},
            new String[]{"Entertainment", "Entertainment events, shows, and performances"},
            new String[]{"Social", "Social gatherings, parties, and community events"},
            new String[]{"Gaming", "Gaming tournaments, competitions, and gaming meetups"},
            new String[]{"Food & Drink", "Culinary events, food tastings, and cooking classes"}
        );
        
        for (String[] category : categories) {
            if (!eventCategoryService.existsByName(category[0])) {
                eventCategoryService.createCategory(category[0], category[1]);
            }
        }
    }

    private void seedTags() {
        List<String[]> tags = Arrays.asList(
            new String[]{"urgent", "#FF6B6B"},
            new String[]{"important", "#4ECDC4"},
            new String[]{"beginner-friendly", "#45B7D1"},
            new String[]{"advanced", "#96CEB4"},
            new String[]{"free", "#FFEAA7"},
            new String[]{"paid", "#DDA0DD"},
            new String[]{"online", "#98D8C8"},
            new String[]{"offline", "#F7DC6F"},
            new String[]{"weekend", "#BB8FCE"},
            new String[]{"weekday", "#85C1E9"}
        );
        
        for (String[] tag : tags) {
            if (!tagService.existsByName(tag[0])) {
                tagService.createTag(tag[0], tag[1]);
            }
        }
    }

    private void seedLabels() {
        List<String[]> labels = Arrays.asList(
            new String[]{"featured", "#FF6B6B"},
            new String[]{"new", "#4ECDC4"},
            new String[]{"popular", "#45B7D1"},
            new String[]{"trending", "#96CEB4"},
            new String[]{"limited", "#FFEAA7"},
            new String[]{"exclusive", "#DDA0DD"},
            new String[]{"community", "#98D8C8"},
            new String[]{"professional", "#F7DC6F"},
            new String[]{"casual", "#BB8FCE"},
            new String[]{"formal", "#85C1E9"}
        );
        
        for (String[] label : labels) {
            if (!labelService.existsByName(label[0])) {
                labelService.createLabel(label[0], label[1]);
            }
        }
    }

    private String getRoleDescription(String roleName) {
        switch (roleName) {
            case "ADMIN":
                return "Administrator with full system access";
            case "ORGANIZER":
                return "Event organizer with event management permissions";
            case "PARTICIPANT":
                return "Event participant with basic permissions";
            case "MODERATOR":
                return "Moderator with content management permissions";
            case "USER":
                return "Regular user with basic permissions";
            default:
                return "Default role description";
        }
    }

    private String getPermissionDescription(String permissionName) {
        switch (permissionName) {
            case "CREATE_EVENT":
                return "Create new events";
            case "EDIT_EVENT":
                return "Edit existing events";
            case "DELETE_EVENT":
                return "Delete events";
            case "VIEW_EVENT":
                return "View event details";
            case "MANAGE_PARTICIPANTS":
                return "Manage event participants";
            case "CREATE_TASK":
                return "Create new tasks";
            case "EDIT_TASK":
                return "Edit existing tasks";
            case "DELETE_TASK":
                return "Delete tasks";
            case "VIEW_TASK":
                return "View task details";
            case "ASSIGN_TASK":
                return "Assign tasks to users";
            case "MANAGE_USERS":
                return "Manage user accounts";
            case "MANAGE_ROLES":
                return "Manage user roles and permissions";
            case "VIEW_ANALYTICS":
                return "View system analytics";
            case "MANAGE_CATEGORIES":
                return "Manage event categories";
            case "SEND_NOTIFICATIONS":
                return "Send notifications to users";
            default:
                return "Default permission description";
        }
    }
}
