/**
 * App Routing.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', 
                loadChildren: 'app/components/login/login.module#LoginModule'
            },
            {
                path: 'login', 
                loadChildren: 'app/components/login/login.module#LoginModule'
            },
            {
                path: 'dashboard', 
                loadChildren: 'app/components/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'calendar', 
                loadChildren: 'app/components/calendar/calendar.moduleNew#CalendarModuleNew'
            },
            {
                path: 'mytasks', 
                loadChildren: 'app/components/mytasks/mytasks.module#MyTasksModule'
            },
            {
                path: 'checksreceiveds', 
                loadChildren: 'app/components/commission/checks-received/checks-received-view/checks-received-view.module#ChecksReceivedViewModule'
            },
            {
                path: 'checksreceived', 
                loadChildren: 'app/components/commission/checks-received/checks-received-add/checks-received-add.module#ChecksReceivedAddModule'
            },
            {
                path: 'mynewchecks', 
                loadChildren: 'app/components/commission/my-new-check/my-new-check.module#MyNewCheckModule'
            },
            {
                path: 'touroperators', 
                loadChildren: 'app/components/suppliers/tour-operators/tour-operators-view/tour-operators.module#TourOperatorsModule'
            },
            {
                path: 'properties', 
                loadChildren: 'app/components/suppliers/properties/view-property/properties.module#PropertiesModule'
            },
            {
                path: 'manageProperty', 
                loadChildren: 'app/components/suppliers/properties/add-property/manage-property.module#ManagePropertyModule'
            },
            /*{
                path: 'cruiseLines', 
                loadChildren: 'app/components/suppliers/cruiselines/cruiselines-view/cruiselines.module#CruiseLinesModule'
            },*/
            {
                path: 'cruiselines', 
                loadChildren: 'app/components/suppliers/cruiselines/cruiselines-view/cruiselines-view.module#CruiseLinesViewModule'
            },
            {
                path: 'manageCruiselines', 
                loadChildren: 'app/components/suppliers/cruiselines/cruiselines-add/cruiselines-add.module#ManageCruiseLinesModule'
            },
            {
                path: 'clients', 
                loadChildren: 'app/components/clients/clients-view/clients-view.module#ClientsViewModule'
            },
            {
                path: 'client', 
                loadChildren: 'app/components/clients/client-add/client-add.module#ClientAddModule'
            },
            {
                path: 'users', 
                loadChildren: 'app/components/users/users-view/users-view.module#UsersViewModule'
            },
            {
                path: 'user', 
                loadChildren: 'app/components/users/user-add/user-add.module#UserAddModule'
            },
            {
                path: 'roles', 
                loadChildren: 'app/components/roles/roles-view/roles-view.module#RolesViewModule'
            },
            {
                path: 'role', 
                loadChildren: 'app/components/roles/role-add/role-add.module#RoleAddModule'
            },
            {
                path: 'trips', 
                loadChildren: 'app/components/trips/trips-view/trips-view.module#TripsViewModule'
            },
            {
                path: 'trip', 
                loadChildren: 'app/components/trips/trip-add/trip-add.module#TripAddModule'
            },
            {
                path: 'itineraries', 
                loadChildren: 'app/components/itineraries/itineraries-view/itineraries-view.module#ItinerariesViewModule'
            },
            {
                path: 'addItinerary', 
                loadChildren: 'app/components/itineraries/itinerary-add/itinerary-add.module#ItineraryAddModule'
            },
            {
                path: 'cruiseitineraries', 
                loadChildren: 'app/components/admin/view-cruise-itineraries/view-cruise-itineraries.module#ViewCruiseItinerariesModule'
            },
            {
                path: 'cruiseitinerarie', 
                loadChildren: 'app/components/admin/add-cruise-itineraries/add-cruise-itineraries.module#AddCruiseItinerariesModule'
            },
            {
                path: 'ports', 
                loadChildren: 'app/components/admin/port-view/port-view.module#PortViewModule'
            },
            {
                path: 'port', 
                loadChildren: 'app/components/admin/port-add/port-add.module#PortAddModule'
            },
            {
                path: 'ships', 
                loadChildren: 'app/components/admin/ship-view/ship-view.module#ShipViewModule'
            },
            {
                path: 'ship', 
                loadChildren: 'app/components/admin/ship-add/ship-add.module#ShipAddModule'
            },
            /*{   path: '**', 
                redirectTo: '' 
            }*/
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}