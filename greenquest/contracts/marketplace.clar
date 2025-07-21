;; NFT Marketplace Contract in Clarity

(define-data-var admin principal tx-sender)

(define-map listings uint 
  { seller: principal, price: uint }
)

;; Error Constants
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-NOT-FOUND u101)
(define-constant ERR-ALREADY-LISTED u102)
(define-constant ERR-NOT-OWNER u103)
(define-constant ERR-INSUFFICIENT_PAYMENT u104)

;; Listing an NFT
(define-public (list-nft (nft-id uint) (price uint))
  (begin
    (match (map-get? listings nft-id)
      existing
        (err ERR-ALREADY-LISTED)
      none
        (begin
          (map-set listings nft-id { seller: tx-sender, price: price })
          (ok true)
        )
    )
  )
)

;; Buying an NFT
(define-public (buy-nft (nft-id uint) (payment uint))
  (match (map-get? listings nft-id)
    listing-data
      (let 
        (
          (seller (get seller listing-data))
          (price (get price listing-data))
        )
        (if (< payment price)
          (err ERR-INSUFFICIENT_PAYMENT)
          (begin
            ;; Simulate NFT + STX transfer
            (map-delete listings nft-id)
            (ok true)
          )
        )
      )
    not-found
      (err ERR-NOT-FOUND)
  )
)

;; Cancel a listing
(define-public (cancel-listing (nft-id uint))
  (match (map-get? listings nft-id)
    listing-data
      (if (is-eq tx-sender (get seller listing-data))
        (begin
          (map-delete listings nft-id)
          (ok true)
        )
        (err ERR-NOT-AUTHORIZED)
      )
    missing
      (err ERR-NOT-FOUND)
  )
)

;; Transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (if (is-eq tx-sender (var-get admin))
      (begin
        (var-set admin new-admin)
        (ok true)
      )
      (err ERR-NOT-AUTHORIZED)
    )
  )
)
