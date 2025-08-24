"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Plus, DollarSign, FileText } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  amount: z.string().min(1, "Valor é obrigatório").refine((val) => {
    // Remove formatação e converte para número
    const numbers = val.replace(/\D/g, '')
    const num = parseInt(numbers, 10) / 100
    return !isNaN(num) && num > 0
  }, "Valor deve ser um número positivo"),
  description: z.string().min(1, "Descrição é obrigatória").max(255, "Descrição muito longa"),
  date: z.date({
    message: "Data é obrigatória",
  }),
  accountId: z.string().min(1, "Conta é obrigatória"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
})

type FormData = z.infer<typeof formSchema>

interface Account {
  id: string
  name: string
  type: string
  balance: number
}

interface Category {
  id: string
  name: string
  type: string
  icon?: string
  color?: string
}

interface AddExpenseDialogProps {
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function AddExpenseDialog({ onSuccess, trigger }: AddExpenseDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
      date: new Date(),
      accountId: "",
      categoryId: "",
    },
  })

  // Carregar contas e categorias
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Carregando dados...")
        
        // Carregar contas
        const accountsResponse = await fetch("/api/accounts")
        console.log("Response de contas:", accountsResponse.status)
        
        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json()
          console.log("Contas carregadas:", accountsData)
          setAccounts(accountsData)
        } else {
          const error = await accountsResponse.json()
          console.error("Erro ao carregar contas:", error)
        }

        // Carregar categorias de gastos
        const categoriesResponse = await fetch("/api/categories?type=EXPENSE")
        console.log("Response de categorias:", categoriesResponse.status)
        
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          console.log("Categorias carregadas:", categoriesData)
          setCategories(categoriesData)
        } else {
          const error = await categoriesResponse.json()
          console.error("Erro ao carregar categorias:", error)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }

    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          amount: parseInt(data.amount.replace(/\D/g, ''), 10) / 100,
          type: "EXPENSE",
          date: data.date.toISOString(),
        }),
      })

      if (response.ok) {
        form.reset()
        setIsOpen(false)
        onSuccess?.()
      } else {
        const error = await response.json()
        console.error("Erro ao criar gasto:", error)
        // Aqui você pode adicionar um toast/notification de erro
      }
    } catch (error) {
      console.error("Erro ao criar gasto:", error)
      // Aqui você pode adicionar um toast/notification de erro
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '')
    
    // Se não há números, retorna vazio
    if (!numbers) return ''
    
    // Converte para número (em centavos)
    const numericValue = parseInt(numbers, 10)
    
    // Converte centavos para reais
    const reais = numericValue / 100
    
    // Formata para moeda brasileira
    return reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      form.reset()
    }
  }

  const defaultTrigger = (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button size="lg" className="w-full sm:w-auto group">
        <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
        Adicionar Novo Gasto
      </Button>
    </motion.div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <DialogTitle>Adicionar Novo Gasto</DialogTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <DialogDescription>
                Registre um novo gasto em suas finanças pessoais
              </DialogDescription>
            </motion.div>
          </DialogHeader>
        
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span>Valor *</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                              R$
                            </span>
                            <Input
                              {...field}
                              placeholder="0,00"
                              className="pl-10 focus:ring-2 focus:ring-primary/20 transition-all"
                              onChange={(e) => {
                                const formatted = formatCurrency(e.target.value)
                                field.onChange(formatted)
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date)
                              setIsCalendarOpen(false)
                            }}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>Descrição *</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: Almoço no restaurante"
                            className="focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a conta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{account.name}</span>
                              <span className="text-muted-foreground text-sm ml-2">
                                R$ {account.balance.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center">
                              {category.icon && (
                                <span className="mr-2">{category.icon}</span>
                              )}
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex gap-3 pt-4"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                        />
                      ) : null}
                      {isLoading ? "Salvando..." : "Adicionar Gasto"}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
