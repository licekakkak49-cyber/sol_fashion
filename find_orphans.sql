SELECT id, name FROM public.products
WHERE id NOT IN (
  SELECT (item->>'productId')::uuid 
  FROM public.sets, jsonb_array_elements(items) as item
  WHERE item->>'isPlaceholder' = 'false'
);
