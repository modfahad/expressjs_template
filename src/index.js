const app = require('./app');

app().listen(parseInt(process.env.PORT), () => {
	// eslint-disable-next-line no-console
	console.log('listening on port :', process.env.PORT);
});
