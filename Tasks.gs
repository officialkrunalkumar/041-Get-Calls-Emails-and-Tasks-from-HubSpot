function getTaskData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  sheet.clear();
  const hubspotApiKey = 'Your_HubSpot_App_Token';
  const url = `https://api.hubapi.com/crm/v3/objects/tasks/search`;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoTimestamp = sevenDaysAgo.toISOString();
  const payload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "hs_createdate",
            operator: "GTE",
            value: sevenDaysAgoTimestamp
          },
          {
            propertyName: "hubspot_team_id",
            operator: "EQ",
            value: "681798"
          }
        ]
      }
    ],
    properties: [
      "hs_all_accessible_team_ids",
      "hs_all_assigned_business_unit_ids",
      "hs_all_owner_ids",
      "hs_all_team_ids",
      "hs_at_mentioned_owner_ids",
      "hs_attachment_ids",
      "hs_body_preview",
      "hs_body_preview_html",
      "hs_body_preview_is_truncated",
      "hs_calendar_event_id",
      "hs_created_by",
      "hs_created_by_user_id",
      "hs_createdate",
      "hs_date_entered_60b5c368_04c4_4d32_9b4a_457e159f49b7_13292096",
      "hs_date_entered_61bafb31_e7fa_46ed_aaa9_1322438d6e67_1866552342",
      "hs_date_entered_af0e6a5c_2ea3_4c72_b69f_7c6cb3fdb591_1652950531",
      "hs_date_entered_dd5826e4_c976_4654_a527_b59ada542e52_2144133616",
      "hs_date_entered_fc8148fb_3a2d_4b59_834e_69b7859347cb_1813133675",
      "hs_date_exited_60b5c368_04c4_4d32_9b4a_457e159f49b7_13292096",
      "hs_date_exited_61bafb31_e7fa_46ed_aaa9_1322438d6e67_1866552342",
      "hs_date_exited_af0e6a5c_2ea3_4c72_b69f_7c6cb3fdb591_1652950531",
      "hs_date_exited_dd5826e4_c976_4654_a527_b59ada542e52_2144133616",
      "hs_date_exited_fc8148fb_3a2d_4b59_834e_69b7859347cb_1813133675",
      "hs_engagement_source",
      "hs_engagement_source_id",
      "hs_follow_up_action",
      "hs_gdpr_deleted",
      "hs_lastmodifieddate",
      "hs_marketing_task_category",
      "hs_marketing_task_category_id",
      "hs_merged_object_ids",
      "hs_modified_by",
      "hs_msteams_message_id",
      "hs_object_id",
      "hs_object_source",
      "hs_object_source_detail_1",
      "hs_object_source_detail_2",
      "hs_object_source_detail_3",
      "hs_object_source_id",
      "hs_object_source_label",
      "hs_object_source_user_id",
      "hs_pipeline",
      "hs_pipeline_stage",
      "hs_product_name",
      "hs_queue_membership_ids",
      "hs_read_only",
      "hs_repeat_status",
      "hs_scheduled_tasks",
      "hs_shared_team_ids",
      "hs_shared_user_ids",
      "hs_task_body",
      "hs_task_campaign_guid",
      "hs_task_completion_count",
      "hs_task_completion_date",
      "hs_task_contact_timezone",
      "hs_task_family",
      "hs_task_for_object_type",
      "hs_task_is_all_day",
      "hs_task_is_completed",
      "hs_task_is_completed_call",
      "hs_task_is_completed_email",
      "hs_task_is_completed_linked_in",
      "hs_task_is_completed_sequence",
      "hs_task_is_overdue",
      "hs_task_is_past_due_date",
      "hs_task_last_contact_outreach",
      "hs_task_last_sales_activity_timestamp",
      "hs_task_missed_due_date",
      "hs_task_missed_due_date_count",
      "hs_task_ms_teams_payload",
      "hs_task_priority",
      "hs_task_probability_to_complete",
      "hs_task_relative_reminders",
      "hs_task_reminders",
      "hs_task_repeat_interval",
      "hs_task_send_default_reminder",
      "hs_task_sequence_enrollment_active",
      "hs_task_sequence_step_enrollment_id",
      "hs_task_sequence_step_order",
      "hs_task_status",
      "hs_task_subject",
      "hs_task_template_id",
      "hs_task_type",
      "hs_time_in_60b5c368_04c4_4d32_9b4a_457e159f49b7_13292096",
      "hs_time_in_61bafb31_e7fa_46ed_aaa9_1322438d6e67_1866552342",
      "hs_time_in_af0e6a5c_2ea3_4c72_b69f_7c6cb3fdb591_1652950531",
      "hs_time_in_dd5826e4_c976_4654_a527_b59ada542e52_2144133616",
      "hs_time_in_fc8148fb_3a2d_4b59_834e_69b7859347cb_1813133675",
      "hs_timestamp",
      "hs_unique_creation_key",
      "hs_unique_id",
      "hs_updated_by_user_id",
      "hs_user_ids_of_all_notification_followers",
      "hs_user_ids_of_all_notification_unfollowers",
      "hs_user_ids_of_all_owners",
      "hs_was_imported",
      "hubspot_owner_assigneddate",
      "hubspot_owner_id",
      "hubspot_team_id",
    ],
    limit: 200
  };
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${hubspotApiKey}`
  };
  let tasks = [];
  let after = null;
  do {
    const options = {
      method: "post",
      headers: headers,
      payload: JSON.stringify({ ...payload, after: after }),
      muteHttpExceptions: true
    };
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    tasks = tasks.concat(data.results);
    after = data.paging ? data.paging.next.after : null;
  } while (after);
  sheet.appendRow([
    "All teams",
    "Business units",
    "All owner IDs",
    "All team IDs",
    "At-Mentioned Owner Ids",
    "Attached file IDs",
    "Notes (preview)",
    "HTML Body Preview",
    "Body Preview Truncated",
    "Calendar Event ID",
    "Created by",
    "Created by user ID",
    "Created at",
    "Date entered 'In Progress (Task Pipeline)'",
    "Date entered 'Completed (Task Pipeline)'",
    "Date entered 'Not Started (Task Pipeline)'",
    "Date entered 'Waiting (Task Pipeline)'",
    "Date entered 'Deferred (Task Pipeline)'",
    "Date exited 'In Progress (Task Pipeline)'",
    "Date exited 'Completed (Task Pipeline)'",
    "Date exited 'Not Started (Task Pipeline)'",
    "Date exited 'Waiting (Task Pipeline)'",
    "Date exited 'Deferred (Task Pipeline)'",
    "Source",
    "Source ID",
    "Follow up action",
    "GDPR deleted",
    "Last modified at",
    "Category",
    "Category ID",
    "Merged record IDs",
    "Last modified by",
    "MS Teams message ID",
    "Record ID",
    "Record creation source",
    "Record source detail 1",
    "Record source detail 2",
    "Record source detail 3",
    "Record creation source ID",
    "Record source",
    "Record creation source user ID",
    "Pipeline",
    "Pipeline stage",
    "Product name",
    "Queue",
    "Read only object",
    "Task repeat status",
    "Scheduled tasks",
    "Shared teams",
    "Shared users",
    "Notes",
    "Campaign GUID",
    "Task Completion Count",
    "Completed at",
    "Contact Time Zone",
    "Task Family",
    "For Object Type",
    "Task is all day",
    "Tasks completed",
    "Call tasks completed",
    "Email tasks completed",
    "LinkedIn tasks completed",
    "Sequence tasks completed",
    "Is Overdue",
    "Is Past Due Date",
    "Last contacted",
    "Last engagement",
    "Task Missed Due Date",
    "Overdue Tasks",
    "Ms Teams Payload",
    "Priority",
    "Task probability to complete",
    "Relative Task Reminders",
    "Reminder",
    "Interval",
    "Send Default Reminder",
    "Sequence Enrollment Is Active",
    "Sequence step enrollment Id",
    "Sequence step number",
    "Task Status",
    "Task Title",
    "Task template id",
    "Task Type",
    "Time in 'In Progress (Task Pipeline)'",
    "Time in 'Completed (Task Pipeline)'",
    "Time in 'Not Started (Task Pipeline)'",
    "Time in 'Waiting (Task Pipeline)'",
    "Time in 'Deferred (Task Pipeline)'",
    "Due date",
    "Unique creation key",
    "Unique ID",
    "Updated by user ID",
    "User IDs of all notification followers",
    "User IDs of all notification unfollowers",
    "User IDs of all owners",
    "Performed in an import",
    "Owner assigned date",
    "Assigned to ID",
    "Assigned to",
    "HubSpot Team"
  ]);
  owners = {}
  tasks.forEach(task => {
    const properties = task.properties;
    if (owners[properties.hubspot_owner_id]) {
      owner = owners[properties.hubspot_owner_id];
    } else {
      var url1 = 'https://api.hubapi.com/owners/v2/owners/' + properties.hubspot_owner_id;
      var options1 = {
        'method': 'get',
        'headers': {
          'Authorization': `Bearer ${hubspotApiKey}`
        },
        'muteHttpExceptions': true
      };
      var response1 = UrlFetchApp.fetch(url1, options1);
      var data1 = JSON.parse(response1.getContentText());
      owner = data1.firstName + " " + data1.lastName;
      owners[properties.hubspot_owner_id] = owner;
    }
    sheet.appendRow([
      properties.hs_all_accessible_team_ids,
      properties.hs_all_assigned_business_unit_ids,
      properties.hs_all_owner_ids,
      properties.hs_all_team_ids,
      properties.hs_at_mentioned_owner_ids,
      properties.hs_attachment_ids,
      properties.hs_body_preview,
      properties.hs_body_preview_html,
      properties.hs_body_preview_is_truncated,
      properties.hs_calendar_event_id,
      properties.hs_created_by,
      properties.hs_created_by_user_id,
      properties.hs_createdate,
      properties.hs_date_entered_60b5c368_04c4_4d32_9b4a_457e159f49b7_13292096,
      properties.hs_date_entered_61bafb31_e7fa_46ed_aaa9_1322438d6e67_1866552342,
      properties.hs_date_entered_af0e6a5c_2ea3_4c72_b69f_7c6cb3fdb591_1652950531,
      properties.hs_date_entered_dd5826e4_c976_4654_a527_b59ada542e52_2144133616,
      properties.hs_date_entered_fc8148fb_3a2d_4b59_834e_69b7859347cb_1813133675,
      properties.hs_date_exited_60b5c368_04c4_4d32_9b4a_457e159f49b7_13292096,
      properties.hs_date_exited_61bafb31_e7fa_46ed_aaa9_1322438d6e67_1866552342,
      properties.hs_date_exited_af0e6a5c_2ea3_4c72_b69f_7c6cb3fdb591_1652950531,
      properties.hs_date_exited_dd5826e4_c976_4654_a527_b59ada542e52_2144133616,
      properties.hs_date_exited_fc8148fb_3a2d_4b59_834e_69b7859347cb_1813133675,
      properties.hs_engagement_source,
      properties.hs_engagement_source_id,
      properties.hs_follow_up_action,
      properties.hs_gdpr_deleted,
      properties.hs_lastmodifieddate,
      properties.hs_marketing_task_category,
      properties.hs_marketing_task_category_id,
      properties.hs_merged_object_ids,
      properties.hs_modified_by,
      properties.hs_msteams_message_id,
      properties.hs_object_id,
      properties.hs_object_source,
      properties.hs_object_source_detail_1,
      properties.hs_object_source_detail_2,
      properties.hs_object_source_detail_3,
      properties.hs_object_source_id,
      properties.hs_object_source_label,
      properties.hs_object_source_user_id,
      properties.hs_pipeline,
      properties.hs_pipeline_stage,
      properties.hs_product_name,
      properties.hs_queue_membership_ids,
      properties.hs_read_only,
      properties.hs_repeat_status,
      properties.hs_scheduled_tasks,
      properties.hs_shared_team_ids,
      properties.hs_shared_user_ids,
      properties.hs_task_body,
      properties.hs_task_campaign_guid,
      properties.hs_task_completion_count,
      properties.hs_task_completion_date,
      properties.hs_task_contact_timezone,
      properties.hs_task_family,
      properties.hs_task_for_object_type,
      properties.hs_task_is_all_day,
      properties.hs_task_is_completed,
      properties.hs_task_is_completed_call,
      properties.hs_task_is_completed_email,
      properties.hs_task_is_completed_linked_in,
      properties.hs_task_is_completed_sequence,
      properties.hs_task_is_overdue,
      properties.hs_task_is_past_due_date,
      properties.hs_task_last_contact_outreach,
      properties.hs_task_last_sales_activity_timestamp,
      properties.hs_task_missed_due_date,
      properties.hs_task_missed_due_date_count,
      properties.hs_task_ms_teams_payload,
      properties.hs_task_priority,
      properties.hs_task_probability_to_complete,
      properties.hs_task_relative_reminders,
      properties.hs_task_reminders,
      properties.hs_task_repeat_interval,
      properties.hs_task_send_default_reminder,
      properties.hs_task_sequence_enrollment_active,
      properties.hs_task_sequence_step_enrollment_id,
      properties.hs_task_sequence_step_order,
      properties.hs_task_status,
      properties.hs_task_subject,
      properties.hs_task_template_id,
      properties.hs_task_type,
      properties.hs_time_in_60b5c368_04c4_4d32_9b4a_457e159f49b7_13292096,
      properties.hs_time_in_61bafb31_e7fa_46ed_aaa9_1322438d6e67_1866552342,
      properties.hs_time_in_af0e6a5c_2ea3_4c72_b69f_7c6cb3fdb591_1652950531,
      properties.hs_time_in_dd5826e4_c976_4654_a527_b59ada542e52_2144133616,
      properties.hs_time_in_fc8148fb_3a2d_4b59_834e_69b7859347cb_1813133675,
      properties.hs_timestamp,
      properties.hs_unique_creation_key,
      properties.hs_unique_id,
      properties.hs_updated_by_user_id,
      properties.hs_user_ids_of_all_notification_followers,
      properties.hs_user_ids_of_all_notification_unfollowers,
      properties.hs_user_ids_of_all_owners,
      properties.hs_was_imported,
      properties.hubspot_owner_assigneddate,
      owner,
      properties.hubspot_owner_id,
      properties.hubspot_team_id,
    ]);
  });
}