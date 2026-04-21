import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue, createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

// Importación de métodos Apex y Esquema de Campos
import getActivityCounts from '@salesforce/apex/EngagementSummaryController.getActivityCounts';
import ENG_NAME_FIELD from '@salesforce/schema/Engagement__c.Name';
import OPP_AMOUNT_FIELD from '@salesforce/schema/Engagement__c.Related_Opportunity__r.Amount';

export default class EngagementSummary extends LightningElement {
    @api recordId;

    // Obtener datos del Engagement (Nombre y Monto de la Opp)
    @wire(getRecord, { recordId: '$recordId', fields: [ENG_NAME_FIELD, OPP_AMOUNT_FIELD] })
    engagement;

    // Obtener conteos de actividades desde Apex
    @wire(getActivityCounts, { engagementId: '$recordId' })
    wiredActivityCounts;

    get engagementName() {
        return getFieldValue(this.engagement.data, ENG_NAME_FIELD);
    }

    get opportunityAmount() {
        return getFieldValue(this.engagement.data, OPP_AMOUNT_FIELD) || 0;
    }

    get completedTasks() {
        return this.wiredActivityCounts.data ? this.wiredActivityCounts.data.tasks : 0;
    }

    get upcomingEvents() {
        return this.wiredActivityCounts.data ? this.wiredActivityCounts.data.events : 0;
    }

    handleQuickFollowUp() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const fields = {
            Subject: `Follow-up on ${this.engagementName}`,
            ActivityDate: tomorrow.toISOString().split('T')[0],
            Status: 'Not Started',
            WhatId: this.recordId,
            TaskSubtype: 'Call'
        };

        const recordInput = { apiName: 'Task', fields };

        createRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Follow-up call scheduled for tomorrow',
                        variant: 'success'
                    })
                );
                // Forzar actualización de los contadores en la UI
                return refreshApex(this.wiredActivityCounts);
            })
            .catch(error => {
                console.error('Error creating task:', error);
            });
    }
}