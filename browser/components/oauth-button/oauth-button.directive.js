'use strict';

app.directive('oauthButton', function (Auth) {
	return {
		scope: {
			providerName: '@'
		},
		restrict: 'E',
		templateUrl: '/browser/components/oauth-button/oauth-button.html'
	}
});