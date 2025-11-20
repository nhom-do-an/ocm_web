"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { addToCartApi } from "@/redux/slices/cartSlice"
import { fetchProduct } from "@/redux/slices/productsSlice"
import { getProductPrice, getProductComparePrice, getProductImageUrl, getProductStock, getProductVariantSKU } from "@/utils/product"
import { toast } from "react-toastify"
import { useRouter } from 'next/navigation'
import { FaLink } from "react-icons/fa";
import { FaFacebookF } from 'react-icons/fa'
import { BsCart4 } from "react-icons/bs";
import { Home } from 'lucide-react'
import { startCheckoutFromCart } from '@/lib/checkout'

interface CollectionViewProps {
  alias: string
}

export default function ProductDetailView({ alias }: CollectionViewProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { currentProduct, loading } = useAppSelector((state) => state.products)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi>()
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [descExpanded, setDescExpanded] = useState(false)

  useEffect(() => {
    if (alias) {
      dispatch(fetchProduct(alias))
    }
  }, [dispatch, alias])

  useEffect(() => {
    if (!mainCarouselApi) return

    const onSelect = () => {
      setSelectedImageIndex(mainCarouselApi.selectedScrollSnap())
    }

    mainCarouselApi.on('select', onSelect)

    return () => {
      mainCarouselApi.off('select', onSelect)
    }
  }, [mainCarouselApi])

  // When the product loads, auto-select the first option value for each attribute
  useEffect(() => {
    if (!currentProduct) return

    const attrs = currentProduct.attributes ? [...currentProduct.attributes].sort((a, b) => a.position - b.position) : []
    const validVariants = currentProduct.variants?.filter((v) => v.title !== "Default Title") ?? []

    if (attrs.length === 0) return

    const defaults: Record<string, string> = {}
    attrs.forEach((attr) => {
      const pos = attr.position
      const optionKey = `option${pos}` as keyof (typeof validVariants)[0]
      const firstVal = validVariants.map((v) => v[optionKey]).find(Boolean)
      if (firstVal) defaults[attr.name] = String(firstVal)
    })

    if (Object.keys(defaults).length > 0) {
      const matchedIndex = currentProduct.variants && currentProduct.variants.findIndex((variant) => {
        return Object.entries(defaults).every(([attrName, attrValue]) => {
          const attrIndex = currentProduct.attributes.findIndex((a) => a.name === attrName)
          if (attrIndex === -1) return false
          const optionKey = `option${attrIndex + 1}` as keyof typeof variant
          return variant[optionKey] === attrValue
        })
      })

      if (typeof matchedIndex === 'number' && matchedIndex !== -1) {
        setSelectedVariantIndex(matchedIndex)
        const matched = currentProduct.variants[matchedIndex]
        if (matched?.image_id) {
          const imageIndex = currentProduct.images?.findIndex((img) => img.id === matched.image_id) ?? 0
          setSelectedImageIndex(imageIndex)
          mainCarouselApi?.scrollTo(imageIndex)
        }
      }
    }
  }, [currentProduct, mainCarouselApi])

  const handleAddToCart = useCallback(() => {
    if (currentProduct) {
      const currentVariant = currentProduct.variants && currentProduct.variants[selectedVariantIndex]
      dispatch(addToCartApi({quantity: quantity,variant_id: currentVariant?.id }));
      toast.success('Thêm vào giỏ hàng thành công!');
    }
  }, [currentProduct, selectedVariantIndex, quantity, dispatch])

  const handleBuyNow = useCallback(async () => {
    if (!currentProduct) {
      return;
    }
    const currentVariant = currentProduct.variants && currentProduct.variants[selectedVariantIndex];
    try {
      await dispatch(addToCartApi({ quantity, variant_id: currentVariant?.id })).unwrap();
      toast.success('Đã thêm vào giỏ, chuyển tới thanh toán...');
      await startCheckoutFromCart(router);
    } catch (error: any) {
      toast.error(error?.message || 'Không thể mua ngay, vui lòng thử lại');
    }
  }, [currentProduct, selectedVariantIndex, quantity, dispatch, router])

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Sao chép liên kết thành công!')
    } catch (err) {
      console.error('copy failed', err)
      toast.error('Không thể sao chép liên kết')
    }
  }, [])

  const handleShareFacebook = useCallback(() => {
    try {
      const url = encodeURIComponent(window.location.href)
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.error('share fb failed', err)
      toast.error('Không thể chia sẻ lên Facebook')
    }
  }, [])

  const handleVariantChange = useCallback((attributeName: string, value: string) => {
    const attrIndex = currentProduct?.attributes?.findIndex((a) => a.name === attributeName) ?? -1
    const pos = attrIndex + 1

    const prevVariant = currentProduct?.variants?.[selectedVariantIndex]

    const matchedIndex = currentProduct?.variants?.findIndex((v) => {
      if (v[`option${pos}` as keyof typeof v] !== value) return false
      if (!prevVariant) return true
      for (let i = 1; i <= 3; i++) {
        if (i === pos) continue
        const prevVal = prevVariant[`option${i}` as keyof typeof prevVariant]
        if (prevVal && v[`option${i}` as keyof typeof v] !== prevVal) return false
      }
      return true
    }) ?? -1

    if (matchedIndex !== -1) {
      const selectedVariant = currentProduct!.variants![matchedIndex]
      if (selectedVariant?.image_id) {
        const imageIndex = currentProduct?.images?.findIndex((img) => img.id === selectedVariant.image_id) ?? 0
        setSelectedImageIndex(imageIndex)
        setSelectedVariantIndex(matchedIndex)
        mainCarouselApi?.scrollTo(imageIndex)
      } else {
        setSelectedVariantIndex(matchedIndex)
      }
    }
  }, [currentProduct, selectedVariantIndex, mainCarouselApi])

  // All hooks must be called before any early returns
  const price = useMemo(
    () => currentProduct ? getProductPrice(currentProduct, selectedVariantIndex) : 0,
    [currentProduct, selectedVariantIndex]
  )
  
  const comparePrice = useMemo(
    () => currentProduct ? getProductComparePrice(currentProduct, selectedVariantIndex) : null,
    [currentProduct, selectedVariantIndex]
  )
  
  const stock = useMemo(
    () => currentProduct ? getProductStock(currentProduct, selectedVariantIndex) : 0,
    [currentProduct, selectedVariantIndex]
  )
  
  const sku = useMemo(
    () => currentProduct ? getProductVariantSKU(currentProduct, selectedVariantIndex) : '',
    [currentProduct, selectedVariantIndex]
  )
  
  const isInStock = useMemo(() => stock > 0, [stock])
  
  const discountPercentage = useMemo(
    () => typeof comparePrice === 'number' && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : null,
    [comparePrice, price]
  )

  const activeVariant = useMemo(
    () => currentProduct?.variants && currentProduct.variants[selectedVariantIndex],
    [currentProduct, selectedVariantIndex]
  )

  const sortedAttributes = useMemo(
    () => currentProduct?.attributes
      ? [...currentProduct.attributes].sort((a, b) => a.position - b.position)
      : [],
    [currentProduct]
  )

  const validVariants = useMemo(
    () => currentProduct?.variants?.filter((v) => v.title !== "Default Title") ?? [],
    [currentProduct]
  )

  const variantsByAttribute = useMemo(
    () => sortedAttributes.map((attr, attrIndex) => {
      const optionKey = `option${attrIndex + 1}` as keyof (typeof validVariants)[0]
      const uniqueValues = Array.from(new Set(validVariants.map((v) => v[optionKey]).filter(Boolean)))
      return {
        attribute: attr,
        values: uniqueValues,
      }
    }),
    [sortedAttributes, validVariants]
  )

  const hasValidVariants = useMemo(
    () => variantsByAttribute.some((attr) => attr.values.length > 0) && !sortedAttributes.some((attr) => attr.name === "Title"),
    [variantsByAttribute, sortedAttributes]
  )

  const primaryCollection = useMemo(
    () => (currentProduct as any)?.collections && (currentProduct as any).collections.length > 0
      ? (currentProduct as any).collections[0]
      : null,
    [currentProduct]
  )

  const { contentHtml, specHtml } = useMemo(() => {
    const rawContent = currentProduct?.content ?? ''
    let content = rawContent
    let spec = ''

    try {
      // Find a heading that contains the phrase "Thông số" (covers "Thông số kỹ thuật", "Thông số kĩ thuật", etc.)
      const specHeadingRegex = /<h[1-6][^>]*>[\s\S]*?Thông\s*số[\s\S]*?<\/h[1-6]>/i
      const specHeadingMatch = specHeadingRegex.exec(rawContent)
      if (specHeadingMatch && typeof specHeadingMatch.index === 'number') {
        const startIdx = specHeadingMatch.index
        const endIdx = startIdx + specHeadingMatch[0].length
        content = rawContent.slice(0, startIdx).trim()

        const afterHeading = rawContent.slice(endIdx)
        const nextHeadingMatch = afterHeading.match(/<h[1-6][^>]*>/i)
        const specEndRelative = nextHeadingMatch && typeof nextHeadingMatch.index === 'number' ? nextHeadingMatch.index : afterHeading.length
        spec = afterHeading.slice(0, specEndRelative).trim()
      }
    } catch (err) {
      content = rawContent
      spec = ''
    }
    
    return { contentHtml: content, specHtml: spec }
  }, [currentProduct])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải sản phẩm...</div>
      </div>
    )
  }

  if (!currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
          <p className="text-gray-600">Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <a href="/" className="text-gray-900 hover:text-red-500 flex items-center gap-1">
              <Home className="h-4 w-4 text-red-500" />
              Trang chủ
            </a>
          </li>
          {primaryCollection && (
            <>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <a
                  href={`/collection/${primaryCollection.alias}`}
                  className={
                    `flex items-center gap-1 ${primaryCollection ? 'text-gray-900 hover:text-red-500' : 'text-gray-500'}`
                  }
                >
                  {primaryCollection.name}
                </a>
              </li>
            </>
          )}
        </ol>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {currentProduct.images && currentProduct.images.length > 0 && (
            <Carousel
              setApi={setMainCarouselApi}
              className="w-full mb-4"
              opts={{ align: "center", containScroll: "trimSnaps" }}
            >
              <CarouselContent>
                {currentProduct.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image.url || "/placeholder.jpg"}
                        alt={currentProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}

          {currentProduct.images && currentProduct.images.length > 1 && (
            <div className="relative">
              <Carousel
                className="w-full"
                opts={{ containScroll: "trimSnaps", dragFree: true, align: "start" }}
              >
                <CarouselContent className="-ml-2">
                  {currentProduct.images.map((image, index) => (
                    <CarouselItem key={index} className="pl-2 basis-1/4">
                      <button
                        onClick={() => {
                          setSelectedImageIndex(index)
                          mainCarouselApi?.scrollTo(index)
                        }}
                        className={`w-full aspect-square border-2 rounded-lg overflow-hidden transition-all ${
                          selectedImageIndex === index ? "border-red-500 ring-2 ring-red-300" : "border-gray-300"
                        }`}
                      >
                        <img
                          src={image.url || "/placeholder.jpg"}
                          alt={`${currentProduct.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="right-2 top-1/2 -translate-y-1/2 z-10" />
              </Carousel>
            </div>
          )}
          {/* Share */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Chia sẻ:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                title="Sao chép liên kết"
                aria-label="Sao chép liên kết"
                className="cursor-pointer w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-100 hover:border-red-500 transition-colors"
              >
                <FaLink className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={handleShareFacebook}
                title="Chia sẻ lên Facebook"
                aria-label="Chia sẻ lên Facebook"
                className="cursor-pointer w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 hover:border-red-500 transition-colors bg-blue-600"
              >
                <FaFacebookF className="w-4 h-4 text-white bg-blue-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4 text-gray-700">{currentProduct.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-red-600">{price.toLocaleString()}đ</span>
            {typeof comparePrice === 'number' && comparePrice > price && (
              <span className="text-xl text-gray-400 line-through">{comparePrice.toLocaleString()}đ</span>
            )}
            {discountPercentage && (
              <Badge variant="destructive" className="text-sm">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {isInStock ? (
              <Badge variant="secondary" className="text-green-600">
                Còn {stock} sản phẩm
              </Badge>
            ) : (
              <Badge variant="destructive">Hết hàng</Badge>
            )}
          </div>

          {/* SKU */}
          <div className="mb-6 flex gap-2">
            <span className="font-bold">Mã sản phẩm:</span> 
            <span className="text-red-500">{sku}</span>
          </div>

          {hasValidVariants && (
            <div className="mb-6">
              {variantsByAttribute.map(({ attribute, values }) => (
                <div key={attribute.id} className="mb-4">
                  <label className="block mb-3 font-bold">{attribute.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {values
                      .filter((value) => typeof value === "string" || typeof value === "number")
                      .map((value) => {
                        const variant = validVariants.find(
                          (v) => v.option1 === value || v.option2 === value || v.option3 === value,
                        )
                            return (
                              <button
                                key={String(value)}
                                onClick={() => handleVariantChange(attribute.name, String(value))}
                                className={`cursor-pointer flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                                  (activeVariant && (activeVariant[`option${attribute.position}` as keyof typeof activeVariant] === value))
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                              >
                                {attribute.name === 'Màu sắc' && variant?.image && (
                                  <img
                                    src={variant.image.url || "/placeholder.jpg"}
                                    alt={String(value)}
                                    className="w-10 h-10 object-cover rounded-full flex-shrink-0"
                                  />
                                )}
                                <span className="text-sm font-medium">{String(value)}</span>
                              </button>
                            )
                      })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block font-bold mb-2">Số lượng</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="text-lg font-medium w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                disabled={quantity >= stock}
              >
                +
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-10 gap-3 items-stretch">
              <Button
                size="3xl"
                className="cursor-pointer bg-red-600 text-white hover:bg-red-700 text-lg px-6 py-3 rounded-lg w-full md:col-span-7 flex flex-col justify-center items-center gap-0"
                onClick={handleBuyNow}
                disabled={!isInStock}
              >
                <span>Mua ngay</span>
                <span className="text-sm">(Giao hàng tận nơi)</span>
              </Button>

              <Button
                size="3xl"
                className="cursor-pointer w-full md:col-span-3 flex flex-col justify-center items-center gap-0"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <BsCart4 />
                {isInStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
              </Button>
            </div>
          </div>

          {/* Summary if exists else fallback a mockup */}
          {currentProduct.summary ? (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div
                  className="
                    text-gray-700 text-sm leading-relaxed
                    [&>ul]:list-none
                    [&>ul>li]:relative
                    [&>ul>li]:pl-8
                    [&>ul>li]:mb-2
                    [&>ul>li]:before:content-['✓']
                    [&>ul>li]:before:absolute
                    [&>ul>li]:before:left-0
                    [&>ul>li]:before:top-1
                    [&>ul>li]:before:flex
                    [&>ul>li]:before:items-center
                    [&>ul>li]:before:justify-center
                    [&>ul>li]:before:w-4
                    [&>ul>li]:before:h-4
                    [&>ul>li]:before:rounded-full
                    [&>ul>li]:before:bg-green-600
                    [&>ul>li]:before:text-white
                    [&>ul>li]:before:text-xs
                    [&>ul>li]:before:font-bold
                  "
                  dangerouslySetInnerHTML={{ __html: currentProduct.summary }}
                />
              </CardContent>
            </Card>
          ): (
            <Card className="mt-4">
              <CardContent
                className="
                  p-4 text-gray-700 text-sm leading-relaxed
                  [&>ul]:list-none
                  [&>ul>li]:relative
                  [&>ul>li]:pl-7
                  [&>ul>li]:mb-2
                  [&>ul>li]:before:content-['✓']
                  [&>ul>li]:before:absolute
                  [&>ul>li]:before:left-0
                  [&>ul>li]:before:top-[2px]
                  [&>ul>li]:before:flex
                  [&>ul>li]:before:items-center
                  [&>ul>li]:before:justify-center
                  [&>ul>li]:before:w-4
                  [&>ul>li]:before:h-4
                  [&>ul>li]:before:rounded-full
                  [&>ul>li]:before:bg-green-600
                  [&>ul>li]:before:text-white
                  [&>ul>li]:before:text-[10px]
                  [&>ul>li]:before:font-bold
                "
              >
                <ul>
                  <li>Chất lượng sản phẩm đảm bảo</li>
                  <li>An toàn với sức khỏe người tiêu dùng</li>
                  <li>Bảo hành và đổi trả dễ dàng</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {currentProduct.content && (
        <div className="mt-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">Mô tả sản phẩm</h3>
                      <div className="relative">
                        <div
                          className={`text-gray-700 transition-all ${descExpanded ? '' : 'max-h-40 overflow-hidden'}`}
                          dangerouslySetInnerHTML={{ __html: contentHtml || currentProduct.content }}
                        />

                        {!descExpanded ? (
                          <>
                            <div className="absolute left-0 right-0 bottom-0 h-20 pointer-events-none">
                              <div className="h-full w-full bg-gradient-to-t from-white to-transparent" />
                            </div>

                            <div className="absolute left-0 right-0 bottom-2 flex justify-center pointer-events-none">
                              <button
                                onClick={() => setDescExpanded(true)}
                                aria-expanded={descExpanded}
                                className="pointer-events-auto px-3 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 text-sm font-medium cursor-pointer transition-shadow duration-150 hover:shadow-sm hover:shadow-red-500"
                                title="Xem thêm"
                              >
                                Xem thêm
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="mt-3 flex justify-center">
                            <button
                              onClick={() => setDescExpanded(false)}
                              aria-expanded={descExpanded}
                              className="px-3 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 text-sm font-medium cursor-pointer transition-shadow duration-150 hover:shadow-sm hover:shadow-red-500"
                              title="Thu gọn"
                            >
                              Thu gọn
                            </button>
                          </div>
                        )}
                      </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">Thông số kỹ thuật</h3>
                      <div>
                        <div className="overflow-hidden rounded-lg bg-white border [&>div>table]:w-full [&>div>table]:border [&>div>table]:border-gray-200 [&>div>table>tbody>tr:nth-child(odd)]:bg-gray-100 [&>div>table>tbody>tr:nth-child(even)]:bg-gray-50 [&>div>table>tr>td]:px-3 [&>div>table>tr>td]:py-2">
                          {specHtml ? (
                            <div className="p-0" dangerouslySetInnerHTML={{ __html: specHtml }} />
                          ) : (
                            <div className="p-0">
                              <table className="w-full border-collapse">
                                <tbody>
                                  <tr>
                                    <td className="px-3 py-2 font-medium text-sm text-gray-700">Chất liệu</td>
                                    <td className="px-3 py-2 text-sm text-gray-600">Đạt chuẩn</td>
                                  </tr>
                                  <tr>
                                    <td className="px-3 py-2 font-medium text-sm text-gray-700">Kích thước</td>
                                    <td className="px-3 py-2 text-sm text-gray-600">Đạt chuẩn</td>
                                  </tr>
                                  <tr>
                                    <td className="px-3 py-2 font-medium text-sm text-gray-700">Trọng lượng</td>
                                    <td className="px-3 py-2 text-sm text-gray-600">Đạt chuẩn</td>
                                  </tr>
                                  <tr>
                                    <td className="px-3 py-2 font-medium text-sm text-gray-700">Bảo hành</td>
                                    <td className="px-3 py-2 text-sm text-gray-600">24 tháng</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                  </CardContent>
                </Card>
              </div>
            </div>
        </div>
      )}
    </div>
  )
}
