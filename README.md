# Acme Services - Engagement Management Solution

**Author:** Barker Malimba
**Architecture:** Hybrid (Declarative Configuration + Programmatic SFDX)

## 1. Overview
This repository contains a customized Salesforce solution for Acme Services to manage "Engagements". It integrates declarative tools (Custom Objects, Flows, App Builder, Reports) with programmatic development (Lightning Web Components and Apex) to provide a centralized, automated, and trackable project management experience within the Sales App.

**Reference Test Record used in documentation:** `Consultoría de transformación digital` and `"Desarrollo de sistemas"`.

---

## 2. What Was Built, Assumptions & Validation Guide (#3 - #8)

### #3 Activities (Calls, Emails, Events)
* **What was built:** Standard Activity tracking configured and exposed on the Engagement, Account, and Opportunity objects.
* **How to test / Validate:** 1. Open the Sales App and navigate to the Engagement record (`Consultoría de transformación digital`).
  2. In the Activity Timeline, view the successfully logged Call, sent Email, and upcoming Event. *(See "activities" screenshot/ demostrative video).*

### #4 Lightning App Builder & Navigation
* **What was built:** A customized Lightning Record Page for the Engagement object featuring a Highlights Panel, Related Lists, and the custom LWC. Set as the Org default. A custom Lightning Tab was added to the standard Sales App.
* **How to test / Validate:** 1. Open the **Sales App** from the App Launcher.
  2. Click the new **Engagements** tab in the navigation bar.
  3. Open a record to view the clean, customized layout.

### #5 List Views & Charts
* **What was built:** Created specific list views to manage pipeline and workload, including visual analytics.
* **How to test / Validate:**
  1. Navigate to the Engagements tab.
  2. Select **"My Open Engagements"** to see active records.
  3. Select **"Q Engagements by Account"** and click the Chart icon to view the Donut chart aggregating `Sum(Amount)` by Account. *(See "list view" screenshots).*

### #6 LWC + Apex (`engagementSummary`)
* **What was built:** A reactive Lightning Web Component placed on the Engagement record page. It dynamically pulls the related Opportunity Amount and counts activities.
* **Assumptions:** * *Apex* was used for aggregating data (`COUNT()` via SOQL) to ensure server-side performance.
  * *Lightning Data Service (LDS)* was used for the "Quick Follow-Up Call" button to handle record creation purely client-side without unnecessary Apex DML.
* **How to test / Validate:**
  1. View the `Consultoría de transformación digital` Engagement page.
  2. Observe the custom LWC displaying the Opportunity Amount and the Activity counts.
  3. Click **"Quick Follow-Up Call"** -> A Toast message appears, and a new Task (Due tomorrow) is added to the timeline instantly.

### #7 Flow Automation
* **What was built:** Record-Triggered Flow on Opportunity (`Opp_Create_Proposal_Task_on_Engagement`). Includes fault-path handling to prevent unhandled UI exceptions.
* **Assumptions:** * The Task is related to the *Engagement* (`WhatId`) rather than the Opportunity to centralize delivery tasks. 
  * A "Business Days" logic formula was implemented so the `+ 2 days` deadline avoids weekends.
* **How to test / Validate:**
  1. Open an Opportunity linked to an Engagement.
  2. Change Stage to **"Negotiation/Review"** and Save.
  3. Navigate to the related Engagement -> A High-priority Task (`Subject: Prepare proposal`) is successfully created in the timeline. *(See all flow screenshots/Demonstrated in the attached Video Demo).*

### #8 Reporting & Analytics
* **What was built:** A Custom Report Type (`Engagement pipeline`) to allow cross-object querying. Built the `Engagement pipeline` report and a visual Dashboard.
* **How to test / Validate:**
  1. Navigate to the Reports tab and open **"Engagement pipeline"**.
  2. View the Bar Chart showing `Sum(Amount)` grouped by `Status`. 
  3. *Validation Note:* The chart accurately aggregates data across multiple test Engagements, proving the grouping logic and cross-object data retrieval (Opportunity Amounts) function as expected. *(See "report" screenshot).*

---

## 3. Repository Paths & Metadata

**Programmatic Components (Included in this repo):**
* **LWC:** `engagement_project/force-app/main/default/lwc/engagementSummary`
* **Apex Class:** `engagement_project/force-app/main/default/classes/EngagementSummaryController.cls`

**Declarative Metadata (Demonstrated via Visual Evidence):**
* **Flow:** `Opportunity Record - V3`
* **Custom Report Type:** `Engagement pipeline`
* **Report:** `Engagement pipeline`
* **List Views:** `My open engagements` and `Q Engagements by Account`