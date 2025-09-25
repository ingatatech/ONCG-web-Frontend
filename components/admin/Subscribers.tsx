"use client"

import { useState, useEffect } from "react"
import  AdminLayout  from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Search, UserCheck, UserX, Calendar, Filter, Crown } from "lucide-react"
import { Subscriber } from "@/lib/types/Subscribers"
import api from "@/lib/axios"
import LoadingSpinner from "../LoadingSpinner"

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  useEffect(() => {
    filterSubscribers()
  }, [subscribers, searchTerm, statusFilter])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/subscribers")
      if (response) {
        const data = await response.data
        setSubscribers(data)
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterSubscribers = () => {
    let filtered = subscribers

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((subscriber) => subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((subscriber) =>
        statusFilter === "active" ? subscriber.isActive : !subscriber.isActive,
      )
    }

    setFilteredSubscribers(filtered)
  }

  const handleUnsubscribe = async (id: string) => {
    try {
      const response = await fetch(`/api/subscribers/${id}/unsubscribe`, {
        method: "PATCH",
      })
      if (response.ok) {
        fetchSubscribers()
        if (selectedSubscriber?.id === id) {
          setSelectedSubscriber({ ...selectedSubscriber, isActive: false })
        }
      }
    } catch (error) {
      console.error("Error unsubscribing:", error)
    }
  }

  const handleReactivate = async (email: string) => {
    try {
      const response = await fetch("/api/subscribers/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        fetchSubscribers()
        if (selectedSubscriber?.email === email) {
          setSelectedSubscriber({ ...selectedSubscriber, isActive: true })
        }
      }
    } catch (error) {
      console.error("Error reactivating subscriber:", error)
    }
  }


  const openViewModal = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedSubscriber(null)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
<LoadingSpinner />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
  {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Subscribers Management</h1>
                <p className="text-sm text-slate-600">Manage your organization's Subscribers</p>
              </div>
            </div>
          
          </div>
        </div>
        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subscribers</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

             
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscribed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No subscribers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubscribers.map((subscriber) => (
                      <TableRow key={subscriber.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium" onClick={() => openViewModal(subscriber)}>
                          {subscriber.email}
                        </TableCell>
                        <TableCell onClick={() => openViewModal(subscriber)}>
                          <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                            {subscriber.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={() => openViewModal(subscriber)}>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(subscriber.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
              
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {subscriber.isActive ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnsubscribe(subscriber.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReactivate(subscriber.email)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Subscriber Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={closeViewModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Subscriber Details</DialogTitle>
            </DialogHeader>

            {selectedSubscriber && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSubscriber.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <Badge variant={selectedSubscriber.isActive ? "default" : "secondary"}>
                      {selectedSubscriber.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Subscribed Date</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedSubscriber.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

            

                <div className="flex gap-2 pt-4">
                  {selectedSubscriber.isActive ? (
                    <Button
                      variant="outline"
                      onClick={() => handleUnsubscribe(selectedSubscriber.id)}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Unsubscribe
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleReactivate(selectedSubscriber.email)}
                      className="flex-1 text-green-600 hover:text-green-700"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Reactivate
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
