// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
  Draft contract only.
  Requires OpenZeppelin contracts before compilation:
  - @openzeppelin/contracts/token/ERC1155/ERC1155.sol
  - @openzeppelin/contracts/access/Ownable.sol
  - @openzeppelin/contracts/utils/cryptography/ECDSA.sol
  - @openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol
*/

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract MekiAdventureBadge is ERC1155, Ownable {
  using ECDSA for bytes32;

  address public claimSigner;

  mapping(bytes32 => bool) public usedClaims;
  mapping(uint256 => bool) public activeTokenIds;

  event ClaimSignerUpdated(address signer);
  event TokenActiveUpdated(uint256 tokenId, bool active);
  event RewardClaimed(
    bytes32 indexed claimId,
    address indexed wallet,
    uint256 indexed tokenId
  );

  constructor(string memory baseUri, address initialClaimSigner)
    ERC1155(baseUri)
    Ownable(msg.sender)
  {
    claimSigner = initialClaimSigner;
  }

  function setClaimSigner(address signer) external onlyOwner {
    claimSigner = signer;
    emit ClaimSignerUpdated(signer);
  }

  function setTokenActive(uint256 tokenId, bool active) external onlyOwner {
    activeTokenIds[tokenId] = active;
    emit TokenActiveUpdated(tokenId, active);
  }

  function setURI(string memory newUri) external onlyOwner {
    _setURI(newUri);
  }

  function claim(
    bytes32 claimId,
    uint256 tokenId,
    uint256 expiresAt,
    bytes calldata signature
  ) external {
    require(activeTokenIds[tokenId], "TOKEN_NOT_ACTIVE");
    require(!usedClaims[claimId], "CLAIM_USED");
    require(block.timestamp <= expiresAt, "CLAIM_EXPIRED");

    bytes32 digest = MessageHashUtils.toEthSignedMessageHash(
      keccak256(abi.encodePacked(claimId, msg.sender, tokenId, expiresAt))
    );

    address recovered = digest.recover(signature);
    require(recovered == claimSigner, "BAD_SIGNATURE");

    usedClaims[claimId] = true;
    _mint(msg.sender, tokenId, 1, "");

    emit RewardClaimed(claimId, msg.sender, tokenId);
  }
}
