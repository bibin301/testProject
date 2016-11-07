'use strict';

function SettingsController($scope,$state, UserService) {
	'ngInject';
	
	const vm = this;

	$scope.state = $state;
	$scope.$watch('state.current', function(state){
		if(state.name === 'main.settings'){
			$state.go('main.settings.profile');
		}
	});

	vm.save = function(){
		const name = $state.current.name;
		if (name.indexOf('profile') >= 0)
		{
			UserService.saveProfileFields().then((s)=>{
				console.log(s)
			}).catch((e)=>console.log(e));
		}
		else
		{

		}
	}
}

export default SettingsController;