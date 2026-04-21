# Engagement Insights - Lightning Web Component

**Author:** Barker Malimba 
**Ecosystem:** Salesforce DX (SFDX)

## Overview
This repository contains the programmatic customizations developed for the Acme Services Engagement Management project. The core deliverable is the `engagementSummary` Lightning Web Component (LWC) and its accompanying Apex controller, designed to sit on the `Engagement__c` Lightning Record Page.

The component provides real-time contextual data and a frictionless way for consultants to log follow-up actions without leaving the page.

## Technical Architecture

This component utilizes a hybrid data-fetching strategy to balance performance and best practices:

1. **Lightning Data Service (LDS):**
   * Uses `@wire(getRecord)` to fetch the current Engagement Name and the Related Opportunity Amount dynamically.
   * Uses `createRecord` API to generate a new "Quick Follow-Up" Task client-side, avoiding unnecessary Apex DML operations.
2. **Apex Server-Side Aggregation:**
   * Uses the `@salesforce/apex` module to call the `EngagementSummaryController`.
   * The Apex controller runs highly optimized `SOQL COUNT()` queries to calculate "Completed Tasks" and "Upcoming Events" securely (`with sharing`).
3. **Reactivity:**
   * Integrates `refreshApex` so the UI instantly updates the activity counters as soon as the user logs a new quick follow-up call.

## Code Structure & Breakdown

### Frontend (LWC): `force-app/main/default/lwc/engagementSummary`
* **`engagementSummary.html`:** The UI template utilizing Salesforce Lightning Design System (SLDS) grids, standard typography classes, and `lightning-formatted-number` for accurate currency rendering.
* **`engagementSummary.js`:** The JavaScript controller managing reactive variables, LDS wires, and the Promise-based logic for creating Follow-up Tasks with `ShowToastEvent` success handling.
* **`engagementSummary.js-meta.xml`:** Metadata configuration restricting the component's visibility exclusively to `lightning__RecordPage` layouts for the `Engagement__c` custom object.

### Backend (Apex): `force-app/main/default/classes/`
* **`EngagementSummaryController.cls`:** The backend logic. It exposes the `@AuraEnabled(cacheable=true)` method `getActivityCounts()`, returning a structured `Map<String, Integer>` containing the aggregated counts of completed tasks and future events.

## Deployment

To deploy this component to an authenticated Salesforce Org, run the following command from the project root:

```bash 
sf project deploy start --target-org <AliasOrUsername>
```


To push changes to a Scratch Org:
```bash 
sf project push
```