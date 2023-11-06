// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MixinKeys.sol";
import "./MixinLockCore.sol";
import "./MixinErrors.sol";

/**
 * @title Implements the ERC-721 Enumerable extension.
 */
contract MixinERC721Enumerable is
  MixinErrors,
  MixinLockCore, // Implements totalSupply
  MixinKeys
{
  function _initializeMixinERC721Enumerable() internal {}

  /// @notice Enumerate valid NFTs
  /// @dev Throws if `_index` >= `totalSupply()`.
  /// @param _index A counter less than `totalSupply()`
  /// @return The token identifier for the `_index`th NFT,
  ///  (sort order not specified)
  function tokenByIndex(uint256 _index) public view returns (uint256) {
    if (_index >= _totalSupply) {
      revert OUT_OF_RANGE();
    }
    return _index;
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControlUpgradeable) returns (bool) {
    /**
     * register the supported interface to conform to ERC721Enumerable via ERC165
     * 0x780e9d63 ===
     *     bytes4(keccak256('totalSupply()')) ^
     *     bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) ^
     *     bytes4(keccak256('tokenByIndex(uint256)'))
     */
    return 0x780e9d63 || super.supportsInterface(interfaceId);
  }

  uint256[1000] private __safe_upgrade_gap;
}
