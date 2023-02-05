const Wallet = artifacts.require("Wallet");
const truffleAssert = require('truffle-assertions');

contract("Wallet", async accounts => {
    let walletInstance;

    beforeEach(async () => {
        walletInstance = await Wallet.new();
    });

    it("Deberia pasar la propiedad de la Wallet al msg.sender", async () => {
        const propietarioEsperado = accounts[0];
        const propietarioReal = await walletInstance.obtenerPropietario();
        assert.equal(propietarioReal, propietarioEsperado, "No se paso la propiedad");
    });

    it("Deberia devolver el valor correcto", async () => {
        const balanceEsperado = (await web3.eth.getBalance(walletInstance.address)).toString();
        const balanceReal = (await walletInstance.obtenerSaldoActual()).toString();
        assert.equal(balanceReal, balanceEsperado, "Los balances no son iguales");
    });

    it("Deberia poder retirar todo el saldo", async () => {
  
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: walletInstance.address,
        value: web3.utils.toWei("1", "ether")
      });
  
      const tx = await walletInstance.retirarTodo({ from: accounts[0] });
  
      const balanceContrato = await web3.eth.getBalance(walletInstance.address);
      assert.equal(balanceContrato, 0);
  
      truffleAssert.eventEmitted(tx, "LogRetirarTodo", event => {
        return (
          event.propietario === accounts[0] &&
          event.balance.toString() === web3.utils.toWei("1", "ether")
        );
      });
    });

    it("No deberia permitir retirar mas del saldo actual", async () => {
      const currentBalance = await walletInstance.obtenerSaldoActual();
      await truffleAssert.reverts(
        walletInstance.retirarSaldo(currentBalance + 100),
        "No hay fondos suficientes"
      );
    });

  });
