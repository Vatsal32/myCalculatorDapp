import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { MyCalculatorDapp } from '../target/types/my_calculator_dapp';
import * as assert from "assert";
import {describe} from "mocha";

const { SystemProgram } = anchor.web3;

describe('myCalculatorDapp', () => {
    const provider = anchor.Provider.local();
    anchor.setProvider(provider);

    const calculator = anchor.web3.Keypair.generate();
    const program = anchor.workspace.MyCalculatorDapp as Program<MyCalculatorDapp>;

    console.log(program.rpc);

    let _calculator;

    it('Creates a calculator', async () => {
        await program.rpc.create("Welcome to Solana", {
            accounts: {
                calculator: calculator.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId
            },
            signers: [calculator]
        });

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.greeting === "Welcome to Solana");
        _calculator = calculator;
    });

    it('Adds two numbers', async () => {
        await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
            accounts: {
                calculator: _calculator.publicKey,
            }
        });

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(5)));
        assert.ok(account.greeting === "Welcome to Solana");
    });

    it('Multiplies two numbers', async () => {
        await program.rpc.multiply(new anchor.BN(2), new anchor.BN(3), {
            accounts: {
                calculator: _calculator.publicKey,
            }
        });

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(6)));
        assert.ok(account.greeting === "Welcome to Solana");
    });

    it('Subtracts two numbers', async () => {
        await program.rpc.subtract(new anchor.BN(3), new anchor.BN(2), {
            accounts: {
                calculator: _calculator.publicKey,
            }
        });

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(1)));
        assert.ok(account.greeting === "Welcome to Solana");
    });

    it('Divides two numbers', async () => {
        await program.rpc.divide(new anchor.BN(7), new anchor.BN(3), {
            accounts: {
                calculator: _calculator.publicKey,
            }
        });

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(2)));
        assert.ok(account.remainder.eq(new anchor.BN(1)));
        assert.ok(account.greeting === "Welcome to Solana");
    });
});