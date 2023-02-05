// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Wallet is Ownable {
    constructor (){
    transferOwnership(msg.sender);
    }
    event LogRetirarTodo(address propietario, uint256 balance);
    event LogRetirarSaldo(address propietario, uint256 balance);
    event LogTransferirA(address wallet, uint256 cantidad);
    
    function obtenerSaldoActual() external view returns(uint256){
        return address(this).balance;
    }

    function obtenerPropietario() external view returns(address){
        return owner();
    }

    function retirarTodo() external onlyOwner{
        //Si no tiene balance, no podra realizar la transferencia
        require(address(this).balance > 0, "Wallet vacia");
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
        emit LogRetirarTodo(owner(),balance);
    }

    function retirarSaldo(uint256 cantidad) external onlyOwner{
        //Si el saldo es menor a la cantidad, no puede retirar
        require(address(this).balance >= cantidad, "No hay fondos suficientes");
        payable(owner()).transfer(cantidad);
        emit LogRetirarSaldo(owner(),cantidad);
    }

    function transferirA(address walletExterna,uint256 cantidad) external onlyOwner{
        require(address(this).balance >= cantidad, "No hay fondos suficientes");
        payable(walletExterna).transfer(cantidad);
        emit LogTransferirA(walletExterna, cantidad);
    }

    receive() external payable {

    }

    
}