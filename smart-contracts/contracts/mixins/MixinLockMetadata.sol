// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import "./MixinKeys.sol";
import "./MixinLockCore.sol";
import "./MixinRoles.sol";

/**
 * @title Mixin for metadata about the Lock.
 * @dev `Mixins` are a design pattern seen in the 0x contracts.  It simply
 * separates logically groupings of code to ease readability.
 */
contract MixinLockMetadata is MixinRoles, MixinLockCore, MixinKeys {
  using Strings for uint;
  using Strings for address;

  /// A descriptive name for a collection of NFTs in this contract.Defaults to "Unlock-Protocol" but is settable by lock owner
  string public name;

  /// An abbreviated name for NFTs in this contract. Defaults to "KEY" but is settable by lock owner
  string private lockSymbol;

  // the base Token URI for this Lock. If not set by lock owner, the global URI stored in Unlock is used.
  string private baseTokenURI;

  event LockMetadata(string name, string symbol, string baseTokenURI);

  function _initializeMixinLockMetadata(string calldata _lockName) internal {
    name = _lockName;
  }

  /**
   * Allows the Lock owner to assign
   * @param _lockName a descriptive name for this Lock.
   * @param _lockSymbol a Symbol for this Lock (default to KEY).
   * @param _baseTokenURI the baseTokenURI for this Lock
   */
  function setLockMetadata(
    string calldata _lockName,
    string calldata _lockSymbol,
    string calldata _baseTokenURI
  ) public {
    _onlyLockManager();

    name = _lockName;
    lockSymbol = _lockSymbol;
    baseTokenURI = _baseTokenURI;

    emit LockMetadata(name, lockSymbol, baseTokenURI);
  }

  /**
   * @dev Gets the token symbol
   * @return string representing the token name
   */
  function symbol() external view returns (string memory) {
    if (bytes(lockSymbol).length == 0) {
      return unlockProtocol.globalTokenSymbol();
    } else {
      return lockSymbol;
    }
  }

  /**  @notice A distinct Uniform Resource Identifier (URI) for a given asset.
   * @param _tokenId The iD of the token  for which we want to retrieve the URI.
   * If 0 is passed here, we just return the appropriate baseTokenURI.
   * If a custom URI has been set we don't return the lock address.
   * It may be included in the custom baseTokenURI if needed.
   * @dev  URIs are defined in RFC 3986. The URI may point to a JSON file
   * that conforms to the "ERC721 Metadata JSON Schema".
   * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
   */
  function tokenURI(uint256 _tokenId) external view returns (string memory) {
    string memory URI;
    string memory tokenId;
    string memory lockAddress = address(this).toHexString();
    string memory seperator;

    if (_tokenId != 0) {
      tokenId = _tokenId.toString();
    } else {
      tokenId = "";
    }

    if (address(onTokenURIHook) != address(0)) {
      uint expirationTimestamp = keyExpirationTimestampFor(_tokenId);
      return
        onTokenURIHook.tokenURI(
          address(this),
          msg.sender,
          ownerOf(_tokenId),
          _tokenId,
          expirationTimestamp
        );
    }

    if (bytes(baseTokenURI).length == 0) {
      URI = unlockProtocol.globalBaseTokenURI();
      seperator = "/";
    } else {
      URI = baseTokenURI;
      seperator = "";
      lockAddress = "";
    }

    return string(abi.encodePacked(URI, lockAddress, seperator, tokenId));
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControlUpgradeable) returns (bool) {
    // registering the optional erc721 metadata interface with ERC165.sol using
    // the ID specified in the standard: https://eips.ethereum.org/EIPS/eip-721
    return 0x5b5e139f || super.supportsInterface(interfaceId);
  }

  uint256[1000] private __safe_upgrade_gap;
}
