//controllers

app.controller('MainCtrl', function ($scope, $http, $location, Auth) {
		$scope.isLogin = Auth.isLogin();
		if($scope.isLogin){
			$location.path("/dashboard");
		}
	})
	.controller('RegisterCtrl', function ($scope, $http, $location, Alert) {
		//$scope.nickname = '';
		//$scope.email = '';
		//$scope.password = '';
		//$scope.password2 = '';
		$scope.register = function () {
			var data = {
				'nickname': $scope.nickname,
				'email': $scope.email,
				'password': $scope.password,
				'password2': $scope.password2
			};
			$http.post(Config.host + "/user/register", data)
				.success(function (response, status) {
					$scope.response = response;
					$location.path('/login');
				})
		};
	})
	.controller('LoginCtrl', function ($scope, $http, $location, Alert, Auth) {
		//$scope.email = "";
		//$scope.password = "";
		$scope.login = function () {
			var data = {
				'email': $scope.email,
				'password': $scope.password
			};
			$http.post(Config.host + "/user/login", data)
				.success(function (response, status) {
					Auth.setToken(response.token);
					$location.path('/dashboard');
				});
		};
	})
	.controller('LogoutCtrl', function ($scope, $http, $location, Auth) {
		$scope.logout = function () {
			Auth.removeToken();
			$location.path('/');
		};
	})
	.controller('AccountCtrl',
	function ($scope, $http, $location) {
		//$scope.nickname = "";
		//$scope.description = "";
        //
		//$scope.origin_password = "";
		//$scope.password = "";
		//$scope.password2 = "";

		$http.get(Config.host + "/user/account")
			.success(function (response, status) {
				$scope.nickname = response.nickname;
				$scope.description = response.description;
			});
		$scope.update_account = function () {
			var account_info = {
				'nickname': $scope.nickname,
				'description': $scope.description
			};
			$http.put(Config.host + "/user/account", data = account_info)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					$location.path("/account");
				});
		};

		$scope.update_password = function () {
			var password_info = {
				'origin_password': $scope.origin_password,
				'password': $scope.password,
				'password2': $scope.password2
			};
			$http.put(Config.host + "/user/password", data = password_info)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					$location.path('/account');
				});
		};
	})
	.controller('DashboardCtrl', function ($scope, $http) {
		console.log('dashboard');

	})
	.controller('GroupCtrl', function ($scope, $http, $location, Alert, $routeParams) {
		$http.get(Config.host + "/my_groups")
			.success(function (response, status) {
				$scope.groups = response.my_groups;
			});

		$scope.update_group = function () {
			var group_info = {
				'name': $scope.name,
				'alias': $scope.alias,
				'address': $scope.address,
				'contact': $scope.contact,
				'email': $scope.email,
				'description': $scope.description,
				'supmice': {}
			};

			$http.put(Config.host + "/group/" + $scope.group_alias, data = group_info)
				.success(function (response, status) {
					$scope.response = response;
					console.log(response);
					$location.path('/group/' + $scope.group_alias);
				});
		};

		$scope.delete_group = function () {
			$http.delete(Config.host + "/group/" + $scope.group_alias)
				.success(function (response, status) {
					$scope.response = response;
					console.log(response);
					$location.path('/groups/new')
				});
		};
	})
	.controller('NewGroupCtrl', function ($scope, $http, $location, Alert) {
		$scope.name = "";
		$scope.alias = "";
		$scope.address = "";
		$scope.contact = "";
		$scope.email = "";
		$scope.description = "";

		$scope.new_group = function () {
			var group_info = {
				'name': $scope.name,
				'alias': $scope.alias,
				'address': $scope.address,
				'contact': $scope.contact,
				'email': $scope.email,
				'description': $scope.description,
				'supmice': {}
			};

			$http.post(Config.host + "/group", data = group_info)
				.success(function (response, status) {
					$scope.response = response;
					console.log(response);
					$location.path('/dashboard');
				})
				.error(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					console.log(response.msg);
					Alert.error(response.msg);
				});
		};
	})
	.controller('MemberCtrl', function ($scope, $http, $route, Alert, $routeParams) {
		$scope.group_alias = $routeParams.group_alias;

		$http.get(Config.host + "/member/" + $scope.group_alias)
			.success(function (data, status, headers, Config) {
				$scope.members = data;
			});

		$scope.delete_member = function (alias) {
			$http.delete(Config.host + "/member/" + alias)
				.success(function (response, status) {
					$scope.response = response;
					console.log(response);
					$route.reload();
				});
		};
	})
	.controller('NewMemberCtrl', function ($scope, $http, $location, Alert, $routeParams) {
		$scope.name = "";
		$scope.email = "";
		$scope.group_alias = $routeParams.group_alias;

		$scope.invit = function () {
			var member_info = {
				'group_alias': $scope.group_alias,
				'role': '',
				'name': $scope.name,
				'email': $scope.email
			};

			$http.post(Config.host + "/member", data = member_info)
				.success(function (response, status) {
					$scope.response = response;
					
					console.log(response);
					$location.path('/member/' + $routeParams.group_alias);
				});
		};
	})
	.controller('NotificationCtrl', function ($scope, $route, $http, $location, Alert) {

		$http.get(Config.host + "/notification")
			.success(function (data, status, headers, Config) {
				$scope.notifications = data;
			});

		$scope.handle_invitation = function (index, accept) {
			var accept_info = {
				'id': $scope.notifications[index]['_id'],
				'group_alias': $scope.notifications[index]['group_alias'],
				'sender_id': $scope.notifications[index]['sender_id'],
				'receiver_id': $scope.notifications[index]['receiver_id'],
				'accept': accept
			};

			$http.post(Config.host + "/member/response", data = accept_info)
				.success(function (response, status) {
					$scope.response = response;
					$route.reload();
				});
		};
	})
	.controller('JobsCtrl', function ($scope, $http, $location, $routeParams) {
		$scope.jobs = [];
		$scope.group_alias = $routeParams.group_alias;

		$http.get(Config.host + "/job/" + $routeParams.group_alias)
			.success(function (data, status, headers, Config) {
				$scope.jobs = data["jobs"];
				$scope.classes = data["classes"];
				$scope.class_num = data["class_num"];
				$scope.total = data["total"];
			});

		$scope.searchKey = null;
		$scope.job_class = 'all';
		$scope.sortKey = "job_class";
		$scope.searchFilter = function (job) {
			var keyword = new RegExp($scope.searchKey, 'i');
			return (!$scope.searchKey || keyword.test(job.job_title))
				&& ($scope.job_class == 'all' || $scope.job_class == job.job_class);
		};

		$scope.setClass = function(job){
			$scope.job_class = job;
		};

		$scope.setSortKey = function(key){
			$scope.sortKey = key;
		}
	})
	.controller('JobCtrl', function ($scope, $http, $location, $routeParams, translateService) {
		$scope.group_alias = $routeParams.group_alias;
		$scope.job_classes = translateService.getJobClasses();
		$scope.required_educations = translateService.getRequiredEducation();
		$scope.required_work_time = translateService.getRequiredWorkExperience();
		$scope.genders = translateService.getGenders();
		var d = new Date();

		$scope.job = {
			'update_time': d.yyyymmdd(),
			'job_class': $scope.job_classes[0],
			'job_title': "",
			'education': $scope.required_educations[0],
			'work_time': $scope.required_work_time[0],
			'gender': $scope.genders[0],
			'census_register': "",
			'salary': {
				'min': 0,
				'max': 0
			},
			'responsibility': "",
			'requirement': ""
		};

		if($routeParams.job_id){
			$scope.show_delete = true;
			$http.get(Config.host + "/job/" + $scope.group_alias + "/" + $routeParams.job_id)
				.success(function(data, status, headers, Config){
					$scope.job = data;
					//try{
					//	$scope.job.job_class = get_key_by_value($scope.job.job_class, $scope.job_classes);
					//	$scope.job.education = get_key_by_value($scope.job.education, $scope.required_educations);
					//	$scope.job.gender = get_key_by_value($scope.job.gender, $scope.genders);
					//}catch (err){
					//	console.log(err);
					//}
				});

			$scope.update_job = function(){
				$scope.job.job_class = $scope.job.job_class.value;
				$scope.job.education = $scope.job.education.value;
				$scope.job.gender = $scope.job.education.value;
				$http.put(Config.host + "/job/" + $scope.group_alias + "/" + $routeParams.job_id, data=$scope.job)
					.success(function(response, status){
						$location.path('/job/' + $scope.group_alias + "/view/" + response.id);
					});

			};

			$scope.delete_job = function(){
				$http.delete(Config.host + "/job/" + $routeParams.group_alias + "/" + $routeParams.job_id)
					.success(function(response, status){
						$location.path('/jobs/' + $scope.group_alias);
					})
			};
		}

		$scope.new_job = function(){
			$scope.job.job_class = $scope.job.job_class.value;
			$scope.job.education = $scope.job.education.value;
			$scope.job.gender = $scope.job.gender.value;
			$http.post(Config.host + "/job/" + $scope.group_alias, data=$scope.job)
				.success(function(response, status){
					$location.path('/jobs/' + $scope.group_alias);
				});
		};
	});