'use strict';

import dialogTemplateURL from './dialog.html';

function CalendarController($scope, $mdDialog, $filter, AuthenticationService, BrokerageResource, CalendarService, moment, $rootScope, $window, $mdToast) {
    'ngInject';

    $scope.events = [];
    $rootScope.loadingProgress = false;
    const userId = AuthenticationService.getLoggedInUser().userId;
    const isBroker = AuthenticationService.isBroker();
    const month = 11;
    fetchMeetings();
    setEventClick();

    function getStatus (status, isBroker) {
        var customClass="GREEN";
        var ifConfirmButton=true;
        var ifRescheduleButton=true;
        var ifJoinVideoButton=true;
        var formattedStatus=status;
        var extraContent="";

        if (status=="CONFIRM") {
            formattedStatus="Confirmed";

            ifConfirmButton=false;
        }
        if (status == "PENDING") {
            formattedStatus="Pending";
            customClass="GOLDEN";
            ifConfirmButton=false;
            ifJoinVideoButton=false;
        }
        else if (status == "REJECT") {
            formattedStatus="Rejected"
            customClass="RED";

            ifJoinVideoButton=false;
            ifRescheduleButton=false;
            ifConfirmButton=false;
        }
        else if(status == "RESCHEDULE") {
            customClass = "GOLDEN";
            formattedStatus = "Pending";
            ifJoinVideoButton = false;
        }
        // else if (status == "RESCHEDULE") {
        //     // if (isBroker) {
        //         customClass = "GOLDEN";
        //         formattedStatus="Pending"
        //     // }
        //     // else {
        //     //     formattedStatus="New Request"
        //     //     customClass = "RED";
        //     // }
        // }
        // else if (status == "New Application") {
        //     extraContent = "Document Verification Call";
        //     // if (isBroker) {
        //     //     customClass = "RED";
        //     //     formattedStatus = "New Request";
        //     // }
        //     // else {
        //         customClass = "GOLDEN";
        //         formattedStatus = "Pending";
        //     // }
        // }
        return [customClass, ifConfirmButton, ifRescheduleButton, ifJoinVideoButton, formattedStatus, extraContent];
    }

    function formatSlot(slot) {
        var st = moment(slot.startTime, 'DD/MM/YYYY hh:mm').toDate();
        var title = $filter('date')(st, "HH:mm a");
        var vals = getStatus(slot.status, isBroker);

        return {
            title: slot.meetingSubject,
            start: moment(slot.startTime, 'DD/MM/YYYY hh:mm').toDate(),
            end: moment(slot.endTime, 'DD/MM/YYYY hh:mm').toDate(),
            customClass: vals[0],
            ifConfirmButton: vals[1],
            ifRescheduleButton: vals[2],
            ifJoinVideoButton: vals[3],
            formattedStatus: vals[4],
            extraContent: vals[5],
            ...slot
        }
    }

    function fetchMeetings() {
        $scope.events = [];
        if (!isBroker) {
            CalendarService.fetchMeetings(userId, month).then((data) => {
                $scope.events = data.map(formatSlot);
            });
        } else {
            CalendarService.fetchBrokerMeetings().then((data) => {
                $scope.events = data.map(formatSlot);
            });
        }
    }

    function setEventClick () {
        $scope.eventClicked = function($selectedEvent) {
            console.log("slot is ", $selectedEvent);

            let closePopup = function() {
                alert = undefined;
            }

            var slot = $selectedEvent;

            $mdDialog.show({
                parent: angular.element(document.body),
                templateUrl: dialogTemplateURL,
                controller: DialogController
            });

            function DialogController($scope, $mdDialog) {
                'ngInject';
                $scope.slot = slot;
                $scope.isBroker = isBroker;
                $scope.updateAppointment = updateAppointment;

                $scope.closeDialog = function() {
                    $mdDialog.hide();
                }

                function updateAppointment(status) {
                    if (status == "JOIN") {
                        BrokerageResource.getroom({},{
                            'calendarId':$scope.slot.calendarId, 
                            'userId' : $scope.isBroker ? $scope.slot.userEmailId : $scope.slot.brokerEmailId
                        }, function(req){
                            $rootScope.loadingProgress = false;
                            $window.open(req.data, 'Join Video Conferenence', 'width=1024,height=800');
                            $mdToast.showSimple("Invited for Video Conference.")
                        }, function(error){console.log(error);});
                        $mdToast.showSimple("Invited for Video Conference."); 
                    }
                    else {
                        var calendarDetailRequest = {
                          "calendarId": slot.calendarId,
                          "meetingStatus": status
                        };

                        CalendarService.updateAppointmentStatus(calendarDetailRequest).then((data) => {
                            console.log(data);
                            $mdToast.showSimple("Status of the meeting updated.");
                        });
                    }

                    fetchMeetings();
                    $mdDialog.hide();
                }
            }
        }
    }

    $scope.eventCreate = function($date) {}
}

export default CalendarController;