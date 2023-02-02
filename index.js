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
					"sacar",
					"sair",
				],
			},
		])
		.then((answer) => {
			const action = answer["action"];

			action === "Criar conta" ? createAccount() : "";
		})
		.catch((err) => {
			console.log(err);
		});
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

			!fs.existsSync("accounts") ? fs.mkdirSync("accounts") : null;

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
