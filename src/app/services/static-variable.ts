import { AddCruiseItinerariesComponent } from "../components/admin/add-cruise-itineraries/add-cruise-itineraries.component";

export const GlobalVariable = Object.freeze({
    BASE_API_URL: 'http://localhost:8088/',  // Local server
    // BASE_API_URL: 'https://cupcakescrm.appspot.com/',  // Live backend URL
    //BASE_API_URL: 'https://project3-182520.appspot.com/',  // Dev backend URL

    ITINERARY_SMALL_IMAGES : {
        'PROPERTY': 'http://res.cloudinary.com/jst/image/upload/v1523620175/propertyIcon2x_mxdqi0.png',
        'GROUND_TRANSFER': 'http://res.cloudinary.com/jst/image/upload/v1523620175/groundTransferIcon2x_xsu0s2.png',
        'FLIGHT': 'http://res.cloudinary.com/jst/image/upload/v1523620175/flightIcon2x_ccztbg.png',
        'CRUISE': 'http://res.cloudinary.com/jst/image/upload/v1523620173/cruiseIcon2x_rxwtz7.png',
        'CAR': 'http://res.cloudinary.com/jst/image/upload/v1523620175/carIcon2x_isway6.png',
        'TRAIN': 'http://res.cloudinary.com/jst/image/upload/v1523620175/trainIcon2x_way2a6.png',
        'TOUR': 'http://res.cloudinary.com/jst/image/upload/v1523620175/tourIcon2x_mfhrya.png',
        'BLANK': 'http://res.cloudinary.com/jst/image/upload/v1523620427/blank_cgmdza.jpg',
        'TICKET': 'http://res.cloudinary.com/jst/image/upload/v1523621185/ticketIcon2x_pwxztz.png',
    },

    CLIENT_TRIP_DETAIL_URL : 'https://cupcakesclients.appspot.com/trip/',
    ITINERARY_TYPE: { 
        PROPERTIES:'Resort/Hotel', 
        CRUISE:'Cruise',
        TRAIN:'Train'
    },

    SETTING_KEYS: { 
        ALTERNATE_COMMISSION : 'Alternate Commission', 
        ACTIVITY : 'Activity',
        REMINDER : 'Reminder',
        TASK_TYPE : 'Task Type',
        PROPERTY_TYPE : 'Property Type',
        ALLOWED_UPLOAD_TYPE : 'Allowed Upload Type',
        CHECK_STATUS : 'check_status'
    },

    AUTHORIZATION: 'authorization',
    SESSION_USER: 'sessionUser',
    TOKEN: 'Basic abc0def1ghij2klm3nop4qrs5tuv6w7x8y9z0',
    ADD_CLIENT: 'api/client/addClient',
    UPDATE_CLIENT_BY_ID: 'api/client/updateClientById',
    GET_CLIENT_BY_ID: 'api/client/getClientById',
    REMOVE_CLIENT_BY_ID: 'api/client/removeClientById',
    GET_CLIENTS: 'api/client/getClients',
    GET_ALL_CLIENTS: 'api/client/getAllClients',
    IMPORT_CLIENT: 'api/client/importClient',
    INCREASE_TRIP_COUNT :'api/client/increaseTripCounterByClientId',
    DECREASE_TRIPS_COUNT :'api/client/decreaseTripCountersByClientIds',

    
    ADD_RELATION: 'api/relative/addRelative',
    GET_RELATIONS_BY_CLIENTID : 'api/relative/getRelationsByClientId',
    REMOVE_RELATIVE_BY_ID: 'api/relative/removeRelativeById',
    UPDATE_RELATION_BY_ID:'api/relative/updateRelativeById',

    ADD_USER: 'api/user/addUser',
    UPDATE_USER_BY_ID: 'api/user/updateUserById',
    GET_USER_BY_ID: 'api/user/getUserById',
    REMOVE_USER_BY_ID: 'api/user/removeUserById',
    GET_ALL_USERS: 'api/user/getUsers',
    GET_ALL_AGENTS: 'api/user/getAgents',
    GET_USER_TOKEN: 'user/getUserToken', 

    ADD_TRIP: 'api/trip/addTrip',
    UPDATE_TRIP_BY_ID: 'api/trip/updateTripById',
    GET_TRIP_BY_ID: 'api/trip/getTripById',
    REMOVE_TRIP_BY_ID: 'api/trip/removeTripById',
    GET_ALL_TRIPS: 'api/trip/getTrips',
    GET_TRIPS_BY_CLIENT_ID: 'api/trip/getTripCountByClientId',
    GET_COUNT_BY_TRIPID : 'api/trip/getCountInfo',

    GET_ALL_SHIPS: 'api/ship/getShips',
    CHECK_SHIP_BY_CRUISEID : 'api/ship/checkShipByCruiseId',
    CHECK_ITINERARY_BY_CRUISEID : 'api/cruiseitinerary/checkItineraryByCruiseId',
    
    ADD_ITINERARY: 'api/itinerary/addItinerary',
    UPDATE_ITINERARY_BY_ID: 'api/itinerary/updateItineraryById',
    GET_ITINERARY_BY_ID: 'api/itinerary/getItineraryById',
    GET_ITINERARY_BY_TRIP_ID: 'api/itinerary/getItineraryByTripId',
    REMOVE_ITINERARY_BY_ID: 'api/itinerary/removeItineraryById',
    GET_ALL_ITINERARIES: 'api/itinerary/getItineraries',
    SEND_MAIL: 'api/trip/sendMail',
    SEND_INVOICE_MAIL: 'api/trip/sendInvoiceEmail',
    DOWNLOAD_PDF: 'api/trip/downloadPDF',

    ADD_ROLE: 'api/role/addRole',
    UPDATE_ROLE_BY_ID: 'api/role/updateRoleById',
    GET_ROLE_BY_ID: 'api/role/getRoleById',
    REMOVE_ROLE_BY_ID: 'api/role/removeRoleById',
    GET_ROLES: 'api/role/getRoles',

    GET_ALL_PROPERTIES: 'api/property/getProperties',
    GET_PROPERTIES_BY_ID: 'api/property/getPropertyById',
    REMOVE_PROPERTY_BY_ID: 'api/property/removePropertyById',


    GET_ALL_CRUISE_LINES: 'api/cruiseline/getCruiseLines',
    GET_ALL_CRUISE_LINES_TITLE: 'api/cruiseline/getAllCruiseLinesByTitle',

    GET_CRUISE_BY_ID: 'api/cruiseline/getCruiseLineById',
    GET_CRUISE_LINES_BY_IDS : 'api/cruiseline/listCruiseLinesByIds',
    REMOVE_CRUISE_LINES_BY_ID: 'api/cruiseline/removeCruiseLineById',
    ADD_CRUISELINE : 'api/cruiseline/addCruiseLine',
    UPDATE_CRUISELINE_BY_ID: 'api/cruiseline/updateCruiseLineById',

    ADD_CRUISE_ITINERARY: 'api/cruiseitinerary/addCruiseItinerary',
    GET_ALL_CRUISE_ITINERARIES_TITLE: 'api/cruiseitinerary/getAllCruiseItinerariesByTitle',
    UPDATE_CRUISE_ITINERARY_BY_ID: 'api/cruiseitinerary/updateCruiseItineraryById',
    GET_CRUISE_ITINERARY_BY_ID: 'api/cruiseitinerary/getCruiseItineraryById',
    REMOVE_CRUISE_ITINERARY_BY_ID: 'api/cruiseitinerary/removeCruiseItineraryById',


    GET_ALL_COUNTRIES : 'api/country/getAllCountry',
    GET_COUNTRY_BY_ID: 'api/country/getCountryById',
    GET_ALL_STATES_BY_COUNTRY_ID : 'api/state/getAllStatesByCountryId',
    GET_STATE_BY_ID: 'api/state/getStateById',
    GET_ALL_CITIES_BY_STATE_ID : 'api/city/getAllCitiesByStateId',
    GET_ALL_CITIES: 'api/city/getAllCities',
    GET_CITY_BY_ID: 'api/city/getCityById',

    GET_ALL_PORTS : 'api/ship/getPorts',
    GET_PORTS_BY_IDS : 'api/ship/listPortsByIds',
    REMOVE_PORT_BY_ID: 'api/ship/removePortById',
    GET_PORT_BY_ID: 'api/ship/getPortById',
    UPDATE_PORT_BY_ID: 'api/ship/updatePortById',
    ADD_PORT:'api/ship/addPort',
    ADD_SHIP: 'api/ship/addShip',
    UPDATE_SHIP_BY_ID: 'api/ship/updateShipById',
    GET_SHIP_BY_ID: 'api/ship/getShipById',
    GET_SHIPS_BY_IDS:  'api/ship/listShipsByIds',
    REMOVE_SHIP_BY_ID: 'api/ship/removeShipById',
    GET_ALL_STATES:'api/state/getAllStates',
    ADD_ROOM: 'api/room/addRoom',
    UPDATE_ROOM_BY_ID: 'api/room/updateRoomById',
    GET_ROOM_BY_ID: 'api/room/getRoomById',
    REMOVE_ROOM_BY_ID: 'api/room/removeRoomById',
    GET_ALL_ROOMS: 'api/room/getRooms',

    ADD_TRIP_ACTIVITY: 'api/tripactivity/addTripActivity',
    GET_TRIP_ACTIVITY: 'api/tripactivity/getTripActivities',
    GET_ALL_TRIP_ACTIVITY: 'api/tripactivity/getAllTripActivities',
    UPDATE_TRIP_ACTIVITY_BY_ID:'api/tripactivity/updateTripActivityById',
    GET_TRIP_ACTIVITY_BY_ID:'api/tripactivity/getTripActivityById',
    REMOVE_TRIP_ACTIVITY_BY_ID:'api/tripactivity/removeTripActivityById',

    ADD_DOCUMENT: 'api/document/addDocument',
    UPDATE_DOCUMENT_BY_ID: 'api/document/updateDocumentById',
    GET_DOCUMENT_BY_ID: 'api/document/getDocumentById',
    REMOVE_DOCUMENT_BY_ID: 'api/document/removeDocumentById',
    GET_DOCUMENTS: 'api/document/getDocuments',
    UPLOAD_DOCUMENT: 'api/document/uploadDocument',

    ADD_TASK: 'api/task/addTask',
    UPDATE_TASK_BY_ID: 'api/task/updateTaskById',
    GET_TASK_BY_ID: 'api/task/getTaskById',
    REMOVE_TASK_BY_ID: 'api/task/removeTaskById',
    GET_TASKS: 'api/task/getTasks',
    GET_TASKS_BY_ROLE: 'api/task/getTasksByRole',

    ADD_NOTE: 'api/note/addNote',
    UPDATE_NOTE_BY_ID: 'api/note/updateNoteById',
    GET_NOTE_BY_ID: 'api/note/getNoteById',
    REMOVE_NOTE_BY_ID: 'api/note/removeNoteById',
    GET_NOTES: 'api/note/getNotes',

    ADD_EVENT: 'api/event/addEvent',
    GET_EVENTS: 'api/event/getEvents',
    UPDATE_EVENT_BY_ID: 'api/event/updateEventById',
    GET_EVENT_BY_ID: 'api/event/getEventById',
    GET_EVENT_BY_TRIPID: 'api/event/getEventBytripId',
    GET_EVENT_BY_TASKID: 'api/event/getEventBytaskId',
    REMOVE_EVENT_BY_ID: 'api/event/removeEventById',
    REMOVE_EVENT_BY_TRIPID: 'api/event/removeEventByTripId',


    GET_GOOGLE_CALENDAR_EVENTS: 'calendar/getGoogleCalendarEvents',
    ADD_GOOGLE_CALENDAR_EVENT: 'calendar/addGoogleCalendarEvent',
    EDIT_GOOGLE_CALENDAR_EVENT_BY_ID: 'calendar/editGoogleCalendarEventById',

    
    ADD_WORKSPACE_EXTENSION: 'api/workspaceextension/addWorkspaceExtension',
    UPDATE_WORKSPACE_EXTENSION_BY_ID: 'api/workspaceextension/updateWorkspaceExtensionById',
    GET_WORKSPACE_EXTENSION_BY_ID: 'api/workspaceextension/getWorkspaceExtensionById',
    GET_WORKSPACE_EXTENSION_BY_CLIENT_ID: 'api/workspaceextension/getWorkspaceExtensionByClientId',
    REMOVE_WORKSPACE_EXTENSION_BY_ID: 'api/workspaceextension/removeWorkspaceExtensionById',
    GET_WORKSPACE_EXTENSIONS: 'api/workspaceextension/getWorkspaceExtensions',
    
    ADD_EMAIL_AUTOMATION: 'api/emailautomation/addEmailAutomation',
    UPDATE_EMAIL_AUTOMATION_BY_ID: 'api/emailautomation/updateEmailAutomationById',
    GET_EMAIL_AUTOMATION_BY_ID: 'api/emailautomation/getEmailAutomationById',
    GET_EMAIL_AUTOMATION_BY_WORK_EXT_ID: 'api/emailautomation/getEmailAutomationByWorkspaceExtIds',
    REMOVE_EMAIL_AUTOMATION_BY_ID: 'api/emailautomation/removeEmailAutomationById',
    REMOVE_EMAIL_AUTOMATION_BY_WORK_EXT_ID: 'api/emailautomation/removeEmailAutomationByWorkExtId',
    GET_EMAIL_AUTOMATIONS: 'api/emailautomation/getEmailAutomations',

    ADD_BOOKING: 'api/booking/addBooking',
    UPDATE_BOOKING_BY_ID: 'api/booking/updateBookingById',
    GET_BOOKING_BY_ID: 'api/booking/getBookingById',
    REMOVE_BOOKING_BY_ID: 'api/booking/removeBookingById',
    GET_BOOKINGS: 'api/booking/getBookings',
    GET_ALL_BOOKINGS_BY_TRIPID: 'api/booking/getAllBookingsByTripId',
    GET_PAYMENTS_BY_TRIPID: 'api/booking/getPaymentsByTripId',

    GET_TOUROPERATORS: 'api/touroperator/getTourOperators',
    REMOVE_TOUROPERATOR_BY_ID: 'api/touroperator/removeTourOperatorById',
    GET_SETTING_BY_KEY: 'api/setting/getSettingByKey',
   

    ADD_TRIP_DETAIL: 'api/tripdetails/addTripDetails',
    UPDATE_TRIP_DETAIL_BY_ID: 'api/tripdetails/updateTripDetailsById',
    GET_TRIP_DETAIL_BY_ID: 'api/tripdetails/getTripDetailsById',
    REMOVE_TRIP_DETAIL_BY_ID: 'api/tripdetails/removeTripDetailsById',
    GET_TRIP_DETAILS: 'api/tripdetails/getTripDetails',

    ADD_PAYMENT: 'api/payment/addPayment',
    UPDATE_PAYMENT_BY_ID: 'api/payment/updatePaymentById',
    GET_PAYMENT_BY_ID: 'api/payment/getPaymentById',
    REMOVE_PAYMENT_BY_ID: 'api/payment/removePaymentById',
    GET_PAYMENTS: 'api/payment/getPayments',
    GET_ALL_BOOKINGS_WITH_PAYMENTS:'api/payment/getAllBookingWithPayments',

    ADD_INVOICE: 'api/invoice/addInvoice',
    GET_INVOICE_BY_ID: 'api/invoice/getInvoiceById',
    GET_INVOICE_BY_TRIPID:'api/invoice/getInvoiceByTripId',

    GET_ALL_CHECKS : 'api/check/getChecks',
    GET_CHECK_BY_ID : 'api/check/getCheckById',
    ADD_CHECK : 'api/check/addCheck',
    REMOVE_CHECK_BY_ID : 'api/check/removeCheckById',
    UPDATE_CHECK_BY_ID : 'api/check/updateCheckById',
    GET_ALL_SUPPLIERS : 'api/check/getAllSuppliers',
    GET_PAID_BOOKINGS : 'api/check/getReconcilition',
    ADD_RECONCILIATION : 'api/check/addReconcilition',
    EDIT_RECONCILIATION : 'api/check/editReconcilition'
});