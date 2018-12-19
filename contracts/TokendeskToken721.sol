pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title ERC721Mintable
 * @dev ERC721 minting logic
 */
contract TokendeskToken721 is ERC721, MinterRole {
    //string public constant name = "Tokendesk Token";
    //string public constant symbol = "MRS";
    //uint8 public constant decimals = 18;

    //mapping (address => uint256) private balances;
    //mapping (address => mapping (address => uint256)) internal allowed;

    //event Mint(address indexed to, uint256 amount);
    //event MintFinished();

    bool public mintingFinished = false;

    modifier canMint() {
        require(!mintingFinished);
        _;
    }

    /**
    * @dev Function to mint tokens
    * @param to The address that will receive the minted tokens.
    * @param tokenId The token id to mint.
    * @return A boolean that indicates if the operation was successful.
    */
    function mint(address to, uint256 tokenId) public onlyMinter returns (bool) {
        for (uint256 i = 0; i < 100; i++) {
            if (!_exists(tokenId)) {
                _mint(to, tokenId);
                return true;
            }
            tokenId++;
        }
    }
}
