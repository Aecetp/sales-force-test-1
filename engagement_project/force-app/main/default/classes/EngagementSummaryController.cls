public with sharing class EngagementSummaryController {
    
    @AuraEnabled(cacheable=true)
    public static Map<String, Integer> getActivityCounts(Id engagementId) {
        try {
            // Contamos tareas completadas relacionadas al Engagement
            Integer completedTasks = [SELECT COUNT() FROM Task 
                                    WHERE WhatId = :engagementId AND Status = 'Completed'];
            
            // Contamos eventos futuros (reuniones)
            Integer upcomingEvents = [SELECT COUNT() FROM Event 
                                    WHERE WhatId = :engagementId AND StartDateTime >= :Datetime.now()];
            
            return new Map<String, Integer>{
                'tasks' => completedTasks,
                'events' => upcomingEvents
            };
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching activity counts: ' + e.getMessage());
        }
    }
}