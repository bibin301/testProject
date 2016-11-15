'use strict';

function HelpController($http) {
	'ngInject';
	$http({
		method: 'GET',
		url: '/kyck-rest/blockchain/getnric'
	}).then((s)=>{
		const response = s.data.data;
		if (response.message)
		{
			const data = JSON.parse(s.data.data.message.result.message);
			this.hashes = Object.keys(data).map((key)=>{
				return {
					requestId: key,
					nricId: data[key],
					hash: ''
				}
			});			
		}
		else
		{
			
		}
	})

	this.validate = function(hash)
	{
		console.log(hash);
		$http({
			method: 'GET',
			url: '/kyck-rest/blockchain/validate',
			params: {requestId : hash.requestId,
			blockHash: hash.hash}
		}).then((s)=>{
			consol.log(s);
		})
	}
}

export default HelpController;