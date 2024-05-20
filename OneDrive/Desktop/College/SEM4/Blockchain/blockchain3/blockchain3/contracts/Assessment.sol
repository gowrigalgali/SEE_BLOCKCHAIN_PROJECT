// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract Auction {
    address public owner;
    bool public isAuctionActive = true;
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    constructor() {
        owner = msg.sender;
    }
    function startAuction() public onlyOwner {
        isAuctionActive = true;

    }
    uint private index = 0;
    struct Item {
        string Itemname;
        address owner;
        uint256 reservePrice;
        uint256 highBid;
        address highBidder;
        bool status;
    }
    
    mapping (uint => address) public IdToCandidate;
    mapping (address=>string) public IdToCandiName;
    mapping (string=>uint) public ItemnameToIdx;
    Item[] public itemDetails;

    function getItemOwner(string memory _ItemName) public view returns (address) {
        return itemDetails[ItemnameToIdx[_ItemName]].owner;
    }

    function addItem(string memory _ItemName, address _owner, uint256 _reservePrice) public onlyOwner{
        require(isAuctionActive, "Auction is not active");
        itemDetails.push(Item(_ItemName, _owner, _reservePrice, 0, address(0),true));
        ItemnameToIdx[_ItemName]=index++;
    }

    function addAddress(uint _id,string memory CandiName, address addr) public {
        require(isAuctionActive, "Auction is not active");
        IdToCandidate[_id] = addr;
        IdToCandiName[addr] = CandiName;
    }

    function placeBid(uint256 _bid, string memory _Itemname, uint _candidateId) public { 
        require(isAuctionActive, "Auction is not active");
        require(itemDetails[ItemnameToIdx[_Itemname]].status, "Item is closed");
        require(IdToCandidate[_candidateId]!=itemDetails[ItemnameToIdx[_Itemname]].owner,"You can't place bid on your own item");
        uint _idx = ItemnameToIdx[_Itemname];
        require(_bid > itemDetails[_idx].reservePrice && _bid > itemDetails[_idx].highBid, "You cannot bid for this price");
        itemDetails[_idx].highBid = _bid;
        itemDetails[_idx].highBidder = IdToCandidate[_candidateId];
    }

    function endItem(string memory _Itemname) public returns(address, uint) {
        require(isAuctionActive, "Auction is not active");
        uint _idx = ItemnameToIdx[_Itemname];
        itemDetails[_idx].status=false;
        return (itemDetails[_idx].highBidder, itemDetails[_idx].highBid) ;
    }
    function getHighestBidDetails(string memory _itemName) public view returns (address, uint256) {
    require(itemDetails[ItemnameToIdx[_itemName]].status, "Item is closed");
    uint _idx = ItemnameToIdx[_itemName];
    return (itemDetails[_idx].highBidder, itemDetails[_idx].highBid);
}

    function endAuction() public onlyOwner {
        isAuctionActive = false;
    }

    receive() external payable {}

}
