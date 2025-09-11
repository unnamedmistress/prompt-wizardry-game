import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LearningExperience } from "@/types";

interface AppSidebarProps {
  currentExperience: LearningExperience | null;
  currentGameIndex: number;
  gameState: string;
}

export function AppSidebar({ currentExperience, currentGameIndex, gameState }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Only show content for the first game (AI Intro) and when in playing/sequential mode
  const shouldShowContent = currentExperience?.id === "ai-intro" && (gameState === "playing" || gameState === "sequential");

  if (!shouldShowContent) {
    return (
      <Sidebar className={isCollapsed ? "w-14" : "w-80"} collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Lesson Content</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-4 text-sm text-muted-foreground">
                Select a lesson to view content
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-80"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>What is AI?</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4">
            {!isCollapsed && (
              <>
                {/* Video */}
                <div className="px-4">
                  <div className="aspect-[9/16] w-full">
                    <iframe
                      src="https://www.youtube.com/embed/SBcirWAPVK0"
                      title="AI Introduction Video"
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>

                {/* Lesson Content */}
                <Card className="mx-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">AI Basics</CardTitle>
                    <CardDescription className="text-sm">
                      Think of AI like a well‑read parrot: it has seen countless sentences, so when you 
                      prompt it, it guesses the words that usually come next.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Your Mission</h4>
                      <p className="text-muted-foreground">Explore how AI mimics voices, predicts words, and changes tone in this section.</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Activity Steps</h4>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                        <li>Start a conversation by selecting a character and clicking Send.</li>
                        <li>Try different characters to see how AI adapts its voice and style.</li>
                        <li>Notice how the same message gets transformed based on the character's personality.</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What You'll Learn</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>How AI mimics different character voices and styles</li>
                        <li>Why AI predicts certain words over others</li>
                        <li>How tone changes completely transform AI responses</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}