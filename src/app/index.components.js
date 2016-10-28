'use strict';
import FooterModule from './components/footer/footer.module';
import AccessModule from './components/access/access.module';
import DashboardModule from './components/dashboard/dashboard.module';
import MessagesModule from './components/messages/messages.module';

export default angular.module('index.components', [
	FooterModule.name,
	AccessModule.name,
	DashboardModule.name,
	MessagesModule.name
	]);