export class Constants {

    public static HTTP_REQUEST_DELETE_METHOD = 'DELETE';
    
    public static HTTP_RESPONSE_STATUS_CODE_NOT_FOUND = 404;
    public static HTTP_RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR = 500;

    public static GENERIC_ERROR_MESSAGE = 'We are unable to process your request at this time. Please try again later or contact your Slade representative.';
    public static GENERIC_RETRIEVING_RESULTS_MESSAGE = 'Retrieving results...';

    public static CUSTOMER_PREFERENCE_UPDATE_RECORD_NOT_FOUND = 'We are sorry! The preference that you want to update does not exist anymore.';
    public static CUSTOMER_PREFERENCE_NO_MATCH_FOUND = 'We are sorry! We cant find any matching preference.';
    public static REQ_USER_NAME = 'Username is required';
    public static REQ_PASSWORD = 'Password is required';


    public static LOGIN_API_URL = '/shot/api/users/login/';
    public static NEWSFEED_API_URL = '/shot/api/newsfeed/';
    public static WEBPAGE_ACCESSES_API_URL = '/shot/api/common/webpageAccesses/';
    public static HOMEPAGE_ACTIONS_API_URL = '/shot/api/common/homePageActions/';
    public static USER_SITES_AND_ROLES_API_URL = '/shot/api/users/:userId/sites/?roleName=:roleName'

    // Logistics URLs
    public static DELIVERY_RUN_API_URL = '/shot/api/customers/:customerKey/logistics/?newBatchQty=:newBatchQty&orderType=:orderType';
    public static DELIVERY_LOCATIONS_API_URL = '/shot/api/customers/:customerKey/deliveryLocations/';

    public static CUSTOMER_PRODUCT_SEARCH_API_URL = 'shot/api/customers/:customerKey/products/searches/?searchStr=:searchStr&resultSet=:resultSet';
    public static CUSTOMER_PREFERENCES_API_URL = 'shot/api/customers/:customerKey/preferences/searches?productDescription=:productDescription&productType=:productType&batDrugKey=:batDrugKey&batDSUKey=:batDSUKey&triKey=:triKey&msoIngStkKey=:msoIngStkKey&batFormulation=:batFormulation';
    public static CREATE_CUSTOMER_PREFERENCES_API_URL = 'shot/api/customers/:customerKey/preferences/';
    public static UPDATE_CUSTOMER_PREFERENCE_API_URL = 'shot/api/customers/:customerKey/preferences/:prefId/';
    public static UPDATE_CUSTOMER_PREFERENCES_API_URL = 'shot/api/customers/:customerKey/preferences/';
    public static DELETE_CUSTOMER_PREFERENCES_API_URL = 'shot/api/customers/:customerKey/preferences/';
    public static GET_MATCHING_PREFERENCE_API_URL = 'shot/api/customers/:customerKey/preferences/matches?productDescription=:productDescription&productType=:productType&batDrugKey=:batDrugKey&batDSUKey=:batDSUKey&triKey=:triKey&msoIngStkKey=:msoIngStkKey&batFormulation=:batFormulation&dose=:dose&deliveryMechanism=:deliveryMechanism&route=:route&volume=:volume&exact=:exact&infusionDuration=:infusionDuration';

    public static PRODUCT_ATTRIBUTES_API_URL = 'shot/api/customers/:customerKey/products/attributes?drugKey1=:drugKey1&drugKey2=:drugKey2&drugKey3=:drugKey3';

    // Patient Management Constants
    public static PM_TABS_GO_TO_SEARCH = 'patientmanagement.tabs.search';
    public static PM_TABS_TAB_CHANGED_SEARCH = 'patientmanagement.tabs.changed.search';
    public static PM_TABS_TAB_CHANGED_ADD_PATIENT = 'patientmanagement.tabs.changed.addpatient';
    public static PM_TABS_TAB_CHANGED_BULK_ADD_PATIENTS = 'patientmanagement.tabs.changed.bulkaddpatient';
    public static PM_SEARCH_PATIENT_MULTIPLE_API_URL = 'shot/api/customers/:customerKey/patients/?firstName:firstName&surName=:surName&ur=:ur&status=:status';
    public static PM_ADD_EDIT_PATIENT_API_URL = 'shot/api/customers/:customerKey/patients/';
    public static PM_VALIDATE_UPLOAD_PATIENTS_API_URL = 'shot/api/customers/:customerKey/patients/validateUpload/';
    public static PM_UPLOAD_PATIENTS_API_URL = 'shot/api/customers/:customerKey/patients/upload/';
    public static PM_PS_RESULTS_FOUND_MESSAGE = 'We found the below results for your search criteria.';
    public static PM_PS_NO_RESULTS_FOUND_MESSAGE = 'We found no patients matching your search criteria. Please change the criteria above and try again.';
    public static PM_PS_TOO_MANY_RESULTS_FOUND_MESSAGE ='Too many patients found! Limiting results to the 100 most recently modified patients.';
    public static PM_EDIT_PATIENT_CLICKED_EVENT = 'patientmanagement.edit.patient.click.event';
    public static PM_PATIENT_UPDATE_SUCCESS_SEARCH = 'patientmanagement.patient.list.refresh';
    public static PM_PATIENT_UPDATE_SUCCESS_ADD = 'patientmanagement.patient.add.edit.success';
    public static PM_PATIENT_ADD_SUCCESS = 'patientmanagement.patient.add.success';

    public static PM_ADD_PATIENT_MESSAGE = 'Please fill the below details to add a patient to the system.';
    public static PM_ADD_PATIENT_SUCCESS_MESSAGE = 'The below patient has been added to the system.';
    public static PM_EDIT_PATIENT_SUCCESS_MESSAGE = 'The below patient details have been successfully updated in the system.';
    public static PM_ADD_VIEW = 'ADD';
    public static PM_ADD_SUCCESS_VIEW = 'ADD_SUCCESS';

    public static PM_CHANGE_ADD_MODE_TO_MODAL = 'patientmanagement.add.mode.modal';

    public static PM_CURR_VIEW_SEARCH = 'SEARCH';
    public static PM_CURR_VIEW_ADD = 'ADD';

    public static PM_PU_PATIENTS_FROM_FILE_TO_BE_ADDED = 'We found the below patients in the uploaded file, Please confirm if you would like to upload this file?';
    public static PM_PU_PATIENTS_FROM_FILE_ERRORS = "We found the below errors with the patient data from the uploaded file, Please correct the errors and try uploading again."
    public static PM_PU_PATIENTS_FROM_FILE_ADDED = 'We have added the below patients into the system.';

    //My Orders Constants
    public static MY_ORDERS_API_URL = 'shot/api/customers/:customerKey/batches/?date:date&view=:view&orderBy=:orderBy';
    public static MY_ORDERS_NO_ORDERS_FOUND = 'We did not find any orders in the system for the selected dates. Please change the dates and try again!';
    public static DATE_RANGE_CONSTANT = 90;
    public static MY_ORDERS_DEFAULT_VIEW_DAY_VIEW_DELIVERY_TIMES = 'DAY_VIEW_DELV_TIME';
    public static MY_ORDERS_DEFAULT_VIEW_WEEK_VIEW_DELIVERY_TIMES = 'WEEK_VIEW_DELV_TIME';
    public static MY_ORDERS_DEFAULT_VIEW_DAY_VIEW_TREATMENT_TIMES = 'DAY_VIEW_TRMT_TIME';
    public static MY_ORDERS_DEFAULT_VIEW_WEEK_VIEW_TREATMENT_TIMES = 'WEEK_VIEW_TRMT_TIME';

    public static GET_BATCH_DETAILS = 'shot/api/customers/:customerKey/batches/:batchId';
    public static GET_BATCH_HISTORY = 'shot/api/customers/:customerKey/batches/:batchId/histories';

    // User Management URLs
    public static USER_API_URL = 'shot/api/user/:userId/';
    public static USERS_API_BASE_URL = 'shot/api/user/';
    public static USERS_SEARCH_API_URL = 'shot/api/user/?firstName=:firstName&lastName=:lastName&email=:email&isActive=:isActive&siteKey=:siteKey&roleId=:roleId&loginUserId=:loginUserId&loginRole=:loginRole';
    public static USER_ACC_PREF_API_URL = 'shot/api/users/:userId/sites/preferences/';
    public static USER_PASSWORD_API_URL = 'shot/api/user/:userId/password/';

    // Password Reset URLs
    public static PASSWORD_RESET_API_URL = 'shot/password/token/';
    public static PASSWORD_RESET_TOKEN_API_URL = 'shot/password/token/:resetToken';

    // User File URLs
    public static USER_FILE_API_BASE_URL = 'shot/api/siteAdmin/userFiles/';
    public static USER_FILE_MANUAL_REL_URL = 'userManual/';
    public static USER_FILE_MATRIX_REL_URL = 'stabilityMatrix/';

    // NewsFeed URLs
    public static NEWS_FEED_API_BASE_URL = 'shot/api/siteAdmin/newsFeed/'
    public static NEWS_FEED_API_URL = 'shot/api/siteAdmin/newsFeed/:id/';
    
    // Create Orders URLs
    public static GET_ORDER_HISTORY_API_URL = '/shot/api/customers/:customerKey/orders/history/?patientId=:patientId';
    public static CREATE_ORDER_API_URL      = '/shot/api/customers/:customerKey/order/batch/ingredients/';
    public static SUBMIT_ORDERS_API_URL     = '/shot/api/customers/:customerKey/orders/';

    public static UPDATE_BATCH_API_URL      = '/shot/api/customers/:customerKey/order/batch/:batchId';
    public static OFF_HOLD_BATCH_API_URL    = '/shot/api/customers/:customerKey/order/batch/:batchId';
    public static CANCEL_BATCH_API_URL      = '/shot/api/customers/:customerKey/order/batch/cancel/:batchId';

    // Free Stock URLs
    public static FREE_STOCK_SEARCH_TRIALS_URL = '/shot/api/customers/:customerKey/trials/searches/?searchStr=:searchStr';

    public static PRODUCT_ENTRY_TYPE_STANDARD           = "Standard";
    public static PRODUCT_ENTRY_TYPE_CONSIGNMENT        = "Consignment";
    public static PRODUCT_ENTRY_TYPE_CLINICAL_TRIAL     = "ClinicalTrial";
    public static PRODUCT_ENTRY_TYPE_FORMULATION        = "Formulation";
    public static PRODUCT_ENTRY_TYPE_CNF_FORMULATION    = "CNF Formulation";
    public static PRODUCT_ENTRY_TYPE_MULTI_DRUG         = "MultiDrug";

    public static PRODUCT_PROCESS_TYPE_AUTOBATCH            = "Autobatch"; 
    public static PRODUCT_PROCESS_TYPE_MANUAL_STOCK_ONLY    = "ManualStockOnly"; 

    public static BATCH_UPDATE_TYPE_COMMENTS_ONLY   = "C";
    public static BATCH_UPDATE_TYPE_ORDER           = "O";
    public static BATCH_UPDATE_TYPE_BATCH           = "B";

    // Contact Us URLs
    public static CONTACT_US_EMAIL_API_URL = '/shot/api/contactus/email/';

    // Constants for representing true or false 
    public static TRUE  = 't';
    public static FALSE = 'f';

    // Constants for representing YES or NO 
    public static YES  = 'Y';
    public static NO = 'N';

    // Constants for database update actions
    public static INSERT_ACTION = 'I';
    public static UPDATE_ACTION = 'U';

    // Constants for Batch Statuses
    public static BATCH_STATUS_NEW = "New";
    public static BATCH_STATUS_SUBMITTED = "Submitted";
    public static BATCH_STATUS_ON_HOLD = "On Hold";

    // Constants for Free Stock Transfer Mode
    public static FREE_STOCK_TRASFER_IN = "TRANSFER_IN";
    public static FREE_STOCK_TRASFER_OUT = "TRANSFER_OUT";

    /**
     * Role name for a Slade/SHOT Admin
     */
    public static ROLE_SLADE_ADMIN = "SLADE_ADMINISTRATOR";

    /**
     * Role name for a Customer Super User.
     */
    public static ROLE_CUSTOMER_SUPER_USER = "CUSTOMER_SUPER_USER";

    // Events
    public static REFRESH_CUSTOMER_PREFERENCES_LIST_EVENT = "refresh.customer.preferences.list.event";
    public static SHOW_LOADING = "global.loading.show";
    public static HIDE_LOADING = "global.loading.hide";
    public static REFRESH_MYORDER_VIEW_EVENT ="refresh.myorder.view.event";

    // Regular Expressions used for validations
    /*
     * For validating numbers only. 0 - 999999999
     */
    public static  REG_EX_NUMBER_9_PATTERN = /^\d{1,9}$/                       

    /*
     * For validating decimal numbers with precision of 9,4.
     * 9 whole numbers and 4 decimal places. e.g. 0.0001 - 999999999.9999
     */ 
    public static  REG_EX_DECIMAL_9_4_PATTERN = /^\d{1,9}(\.\d{1,4})?$/        

    /*
     * For validating decimal numbers with precision of 9,2.
     * 9 whole numbers and 2 decimal places. e.g. 0.01 - 999999999.99
     */   
    public static  REG_EX_DECIMAL_9_2_PATTERN  = /^\d{1,9}(\.\d{1,2})?$/

    /*
     * For validating decimal numbers with precision of 9,1.
     * 9 whole numbers and 1 decimal place. e.g. 0.1 - 999999999.9
     */
    public static  REG_EX_DECIMAL_9_1_PATTERN = /^\d{1,9}(\.\d{1,1})?$/

    /*
     * For validating alpha numeric.
     * used for trail id, mrn/ur, username
     */
    public static REG_EX_APLHA_NUMERIC = /^[a-zA-Z0-9]*$/;

    /*
     * For validating alpha numeric.
     * used for trail id, mrn/ur, username
     */
    public static REG_EX_NUMERIC = /^[0-9]*$/;

    /*
     * For validating alpha numeric with space, hyphen and apostrophe.
     * used for patient first name, patient surname
     */
    public static REG_EX_NAMES = /^[a-zA-Z0-9 ,.'-]*$/;


    // ERROR CODES
    public static PATIENT_MANAGEMENT_PATIENT_SAVE_DUPLICATE_MRN = 'SH-PM-PS-001';
    public static PATIENT_MANAGEMENT_PATIENT_SAVE_DUPLICATE_MRN_MESSAGE = 'A patient with this MRN number exists in the system, please check the MRN number and try again.';
    public static USER_UPDATE_DUPLICATE_SITE = 'USER-UPDATE-DUPLICATE-SITE';
    public static USER_SITE_NOTIN_LOGIN_USER_SITES = 'USER-SITE-NOTIN-LOGIN_USER-SITES';

    // Reset Password Error Codes
    public static USER_EMAIL_DOES_NOT_EXIST = 'USR-MAIL-NOT-FOUND';
    public static PWD_RESET_TOKEN_EXPIRED = 'PWD-RESET-TOKEN-EXPIRED';
    
    // LOGIN CONSTANTS
    public static USER_PREFERENCES_UPDATED = 'shot.user.preferences.updated';
    public static USER_EMAIL = 'user_email';

    //Contact Us Constants
    public static RECAPTCHA_VERIFY_ERROR_CODE = 'RECAPTCHA_ERROR';
    public static RECAPTCHA_VERIFY_SUCCESS = 'RECAPTCHA_VERIFY_SUCCESS';
    public static EMAIL_SEND_ERROR = 'EMAIL_SEND_ERROR';
    public static EMAIL_SEND_SUCCESS = 'EMAIL_SEND_SUCCESS';
    public static CONTACT_US_EMAIL_SENT_SUCCESS = 'Your details have been submitted. Someone from our team will get back soon.';
    public static CONTACT_US_FORM_ERRORS = 'Please fix the errors below and try again.';
 }
