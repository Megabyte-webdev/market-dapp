// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract MarketPlace {
    struct Item {
        uint256 id;
        string name;
        uint256 price;
        address payable seller;
        address owner;
        bool isSold;
    }

    mapping(uint256 => Item) public items;
    mapping(address => uint256[]) public ownedItems;

    uint256 public itemCount = 0;

    function listItems(string memory _name, uint256 _price) public {
        require(_price > 0, "Price must be greater than 0");
        itemCount++;
        items[itemCount] = Item(
            itemCount,
            _name,
            _price,
            payable(msg.sender),
            msg.sender,
            false
        );
        ownedItems[msg.sender].push(itemCount);
    }

    function purchaseItem(uint256 _itemId) public payable{
        Item storage item = items[_itemId];
        require(_itemId > 0, "Item not found");
        require(msg.sender != item.seller, "Seller cannot buy their own item");
        require(!item.isSold, "Item already sold");
        require(item.price == msg.value, "Incorrect price");
        

        item.isSold = true;
        item.seller.transfer(msg.value);
        transferOwnership(_itemId, item.seller, msg.sender);
    }

    function transferOwnership(
        uint256 _itemId,
        address _from,
        address _to
    ) internal {
        Item storage item = items[_itemId];
        item.owner = _to;

        //remove item from previous owner owned items
        uint256[] storage fromItemList = ownedItems[_from];
        for (uint256 i = 0; i <= fromItemList.length; i++) {
            if (fromItemList[i] == _itemId) {
                delete fromItemList[i];
                break;
            }
        }
        //add item to new owners list
        ownedItems[_to].push(_itemId);
    }


    function transferItem(uint256 _itemId, address _to) public{
        Item storage item =items[_itemId];
        require(_itemId > 0 && _itemId < itemCount, "Item not found");
        require(msg.sender == item.owner, "You are not the owner of this item");
        transferOwnership(_itemId, msg.sender, _to);
    }

    function getItemByOwner(address _owner)public view returns (uint256[] memory){
        return ownedItems[_owner];
    }

}
