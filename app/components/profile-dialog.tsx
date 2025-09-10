"use client"

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, User, Camera, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "../profile/client_profile";
import { fetchUserProfile, updateUserProfile, getProfileImageUrl } from "../profile/client_profile";
import { toast, Toaster } from "sonner";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (open) {
      console.log('Profile dialog opened, loading profile...');
      loadProfile();
    }
  }, [open]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      console.log('=== Profile Component Debug ===');
      console.log('Loading profile...');
      const userProfile = await fetchUserProfile();
      console.log('Profile loaded successfully');
      console.log('Profile Image URL:', userProfile.profileImage);
      console.log('Full Image URL:', `http://localhost:3001${userProfile.profileImage}`);
      console.log('Full Profile Data:', userProfile);
      setProfile(userProfile);
    } catch (error: any) {
      console.error('=== Profile Component Error ===');
      console.error('Error loading profile:', error);
      console.error('Error message:', error.message);
      console.error('========================');
      toast.error('Failed to load profile', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = async () => {
    setIsEditing(true);
    try {
      // Here you would typically open a form or modal for editing
      // For now, we'll just toggle the state
      toast.success('Profile edit mode enabled');
    } catch (error: any) {
      toast.error('Failed to edit profile', {
        description: error.message,
      });
    } finally {
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Loading Profile</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </DialogContent>
        </Dialog>
        <Toaster />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Profile</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">No profile data available</p>
            </div>
          </DialogContent>
        </Dialog>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
          </DialogHeader>
          
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                {/* Avatar Section */}
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    {profile.profileImage ? (
                      <AvatarImage 
                        src={getProfileImageUrl(profile.profileImage)}
                        alt={`${profile.name || profile.username}'s avatar`}
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          console.error('=== Avatar Image Error ===');
                          console.error('Failed to load image:', getProfileImageUrl(profile.profileImage));
                          const target = e.target as HTMLImageElement;
                          target.src = '/avatars/01.png';
                        }}
                      />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {(profile.name || profile.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    onClick={handleEditProfile}
                    disabled={isEditing}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                {/* User Info Section */}
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-semibold">
                    {profile.name || profile.username}
                  </h3>
                  <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm">@{profile.username}</span>
                  </div>
                </div>

                <Separator />

                {/* Stats Section */}
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-muted-foreground">Member since</Label>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(profile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-muted-foreground">Last updated</Label>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 w-full">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleEditProfile}
                    disabled={isEditing}
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                  >
                    Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}