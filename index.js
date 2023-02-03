//NOTE - external modules
import chalk from "chalk";
import inquirer from "inquirer";

//NOTE - Node modules
import fs from "fs";

operations();

function operations() {
	inquirer
		.prompt([
			{
				type: "list",
				name: "action",
				message: "O que você deseja fazer?",
				choices: [
					"Criar conta",
					"Consultar saldo",
					"Depositar",
					"Sacar",
					"Sair",
				],
			},
		])
		.then((answer) => {
			const action = answer["action"];

			if (action === "Criar conta") {
				createAccount();
			} else if (action === "Depositar") {
				deposit();
			} else if (action === "Consultar saldo") {
			} else if (action === "Sacar") {
			} else if (action === "Sair") {
				console.log(chalk.bgBlue.black("Obrigado por usar nossos serviços"));
				process.exit();
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

//NOTE - check if an account exists
function checkAccounts(accountName) {
	if (!fs.existsSync(`accounts/${accountName}.json`)) {
		console.log(chalk.bgRed.white("Esta conta não existe, tente novamente"));
		return false;
	}
	return true;
}

//NOTE - create account
function createAccount() {
	console.log(chalk.bgGreen.black("parabens por escolher o nosso banco!"));
	console.log(chalk.green("Defina as opções da sua conta a seguir"));

	buildAccount();
}

function buildAccount() {
	inquirer
		.prompt([
			{
				name: "accountName",
				message: "Digite um nome para sua conta",
			},
		])
		.then((answer) => {
			const accountName = answer["accountName"];
			console.info(accountName);

			if (!fs.existsSync("accounts")) {
				fs.mkdirSync("accounts");
				return;
			}

			if (fs.existsSync(`accounts/${accountName}.json`)) {
				console.log(
					chalk.bgRed.black(
						"Esta conta ja existe, por favor escolha outro nome"
					)
				);
				buildAccount();
				return;
			} else {
				fs.writeFileSync(
					`accounts/${accountName}.json`,
					'{ "balance": 0 }',
					(err) => console.error(err)
				);
				console.log(
					chalk.bgGreen.white("Prabéns!! sua conta foi criada com sucesse")
				);
				operations();
			}
		})
		.catch((err) => console.error(err));
}

//NOTE - Make a deposit on an existing account
function deposit() {
	inquirer
		.prompt([
			{
				name: "accountName",
				message: "Digite o nome da sua conta",
			},
		])
		.then((answer) => {
			const accountName = answer["accountName"];
			if (!checkAccounts(accountName)) {
				return deposit();
			}
			inquirer
				.prompt([
					{
						name: "amount",
						message: "Qunato você deseja depositar?",
					},
				])
				.then((answer) => {
					const amount = answer["amount"];

					addAmount(accountName, amount);
					operations();
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
}

function addAmount(accountName, amount) {
	const accountData = getAccount(accountName);
	console.log(accountData);

	if (!amount) {
		console.log(
			chalk.bgRed.white("Ocorreu um erro, tente novamente mais tarde")
		);
		return deposit();
	}

	accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

	fs.writeFileSync(
		`accounts/${accountName}.json`,
		JSON.stringify(accountData),
		(err) => console.log(err)
	);

	console.log(
		chalk.green(`Deposito no valor de ${amount} realizado com sucesso`)
	);
}

function getAccount(accountName) {
	const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
		encoding: "utf8",
		flag: "r",
	});

	return JSON.parse(accountJSON);
}
