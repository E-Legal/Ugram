const env = {
	production: {
		port: 3030,
		url: 'http://ugram-api.eba-b322uwpn.us-west-2.elasticbeanstalk.com'
	},
	development: {
		port: 3030,
		url: 'http://ugram-api.eba-b322uwpn.us-west-2.elasticbeanstalk.com'
	},
	test: {
		port: 3030,
		url: 'http://ugram-api.eba-b322uwpn.us-west-2.elasticbeanstalk.com'
	}
};

const mode = process.env.NODE_ENV || 'development';
export default env[mode];